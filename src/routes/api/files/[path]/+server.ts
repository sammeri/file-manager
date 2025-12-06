import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { resolvePath } from '$lib/utils/filesystem';

/**
 * DELETE /api/files/[path]
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const rel = params.path;
	const abs = resolvePath(rel);

	if (!fs.existsSync(abs)) {
		return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
	}

	const stat = fs.statSync(abs);

	if (stat.isDirectory()) {
		fs.rmSync(abs, { recursive: true });
	} else {
		fs.unlinkSync(abs);
	}

	return new Response(JSON.stringify({ status: 'ok' }), {
		headers: { 'Content-Type': 'application/json' }
	});
};

/**
 * PATCH /api/files/[path]
 * body: { newName }
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const rel = params.path;
	const { newName } = await request.json();

	const abs = resolvePath(rel);
	if (!fs.existsSync(abs)) {
		return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
	}

	const newAbs = path.join(path.dirname(abs), newName);

	fs.renameSync(abs, newAbs);

	return new Response(JSON.stringify({ status: 'ok', newName }), {
		headers: { 'Content-Type': 'application/json' }
	});
};

/**
 * GET /api/files/[path] → скачивание файла
 */
export const GET: RequestHandler = async ({ params }) => {
	const abs = resolvePath(params.path);

	if (!fs.existsSync(abs)) {
		return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
	}

	const stat = fs.statSync(abs);
	if (stat.isDirectory()) {
		return new Response(JSON.stringify({ error: 'Is a directory' }), { status: 400 });
	}

	const fileData = fs.readFileSync(abs);
	const fileName = path.basename(abs);

	return new Response(fileData, {
		headers: {
			'Content-Disposition': `attachment; filename="${fileName}"`,
			'Content-Type': 'application/octet-stream'
		}
	});
};
