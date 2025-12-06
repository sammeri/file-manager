import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { ensureUploadDir, resolvePath } from '$lib/utils/filesystem';

ensureUploadDir();

/** Общие заголовки(no-cache) */
const noCacheHeaders = {
	'Content-Type': 'application/json',
	'Cache-Control': 'no-store, max-age=0, must-revalidate',
	Pragma: 'no-cache',
	Expires: '0'
};

/**
 * GET /api/files?path=sub/folder
 */
export const GET: RequestHandler = async ({ url }) => {
	const relativePath = url.searchParams.get('path') || '';
	const targetPath = resolvePath(relativePath);

	if (!fs.existsSync(targetPath)) {
		return new Response(JSON.stringify({ error: 'Path not found' }), {
			status: 404,
			headers: noCacheHeaders
		});
	}

	// читаем директорию
	const items = fs.readdirSync(targetPath).map((name) => {
		const full = path.join(targetPath, name);
		const stat = fs.statSync(full);

		return {
			name,
			isDir: stat.isDirectory(),
			size: stat.size
		};
	});

	return new Response(JSON.stringify({ path: relativePath, items }), {
		headers: noCacheHeaders
	});
};

/**
 * POST /api/files
 * FormData: file + path
 */
export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const file = form.get('file') as File | null;
	const relPath = (form.get('path') as string) || '';
	const targetDir = resolvePath(relPath);

	ensureUploadDir();

	if (!file) {
		return new Response(JSON.stringify({ error: 'File not provided' }), {
			status: 400,
			headers: noCacheHeaders
		});
	}

	if (file.size > 0) {
		// Загружаем файл
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const savePath = path.join(targetDir, file.name);
		fs.writeFileSync(savePath, buffer);
	} else {
		// Создаём папку через пустой файл
		const folderPath = path.join(targetDir, file.name);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}
	}

	return new Response(JSON.stringify({ status: 'ok', name: file.name }), {
		headers: noCacheHeaders
	});
};
