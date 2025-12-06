import { joinPath } from '$lib/utils/path';
import type { FileItem } from '$lib/types';

const API_BASE = '/api/files';

export async function loadFiles(path: string = ''): Promise<FileItem[]> {
	const res = await fetch(`${API_BASE}?path=${encodeURIComponent(path)}`);
	const data: { items: FileItem[] } = await res.json();

	return data.items.sort((a, b) => {
		if (a.isDir && !b.isDir) return -1;
		if (!a.isDir && b.isDir) return 1;
		return a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' });
	});
}

export async function uploadFile(file: File, path: string) {
	const form = new FormData();
	form.append('file', file);
	form.append('path', path);

	await fetch(API_BASE, { method: 'POST', body: form });
}

export async function deleteFile(name: string, path: string) {
	if (!confirm(`Удалить ${name}?`)) return;

	const full = joinPath(path, name);
	const encoded = encodeURIComponent(full);

	await fetch(`${API_BASE}/${encoded}`, { method: 'DELETE' });
}

export async function downloadFile(name: string, path: string) {
	const full = joinPath(path, name);
	const encoded = encodeURIComponent(full);
	const res = await fetch(`${API_BASE}/${encoded}`);
	const blob = await res.blob();
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}

export async function createFolder(folderName: string, path: string) {
	const form = new FormData();
	form.append('file', new Blob(), folderName);
	form.append('path', path);

	await fetch(API_BASE, { method: 'POST', body: form });
}

export async function renameItem(oldName: string, newName: string, path: string) {
	const full = joinPath(path, oldName);
	const encoded = encodeURIComponent(full);
	await fetch(`${API_BASE}/${encoded}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ newName })
	});
}
