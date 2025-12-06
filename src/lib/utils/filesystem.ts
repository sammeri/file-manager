import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

/** uploads/ при запуске */
export function ensureUploadDir(): void {
	if (!fs.existsSync(UPLOAD_DIR)) {
		fs.mkdirSync(UPLOAD_DIR, { recursive: true });
	}
}

/** относительный путь в абсолютный */
export function resolvePath(relativePath: string = ''): string {
	return path.join(UPLOAD_DIR, relativePath);
}
