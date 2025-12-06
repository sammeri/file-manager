import { writable, get } from 'svelte/store';
import * as fileService from '$lib/services/fileService';
import type { FileItem } from '$lib/types';

interface FileStore {
	files: FileItem[];
	currentPath: string;
}

function createFileStore() {
	const { subscribe, set } = writable<FileStore>({
		files: [],
		currentPath: '/'
	});

	return {
		subscribe,

		/* Загружает содержимое папки */
		async load(path: string = '/') {
			const files = await fileService.loadFiles(path);
			set({ files, currentPath: path });
		},

		/* Загружает файл в текущую папку */
		async upload(file: File) {
			const state = get({ subscribe });
			const path = state.currentPath || '/';

			await fileService.uploadFile(file, path);
			await this.load(path);
		},

		/* Создаёт новую папку в текущей директории */
		async createFolder(folderName: string) {
			const state = get({ subscribe });
			const path = state.currentPath || '/';

			await fileService.createFolder(folderName, path);
			await this.load(path);
		},

		/* Удаляет файл или папку */
		async delete(name: string) {
			const state = get({ subscribe });
			const path = state.currentPath || '/';

			await fileService.deleteFile(name, path);
			await this.load(path);
		},

		/* Скачивает файл */
		async download(name: string) {
			const state = get({ subscribe });
			const path = state.currentPath || '/';

			await fileService.downloadFile(name, path);
		},

		/* Переименовывает файл или папку */
		async rename(oldName: string, newName: string) {
			const state = get({ subscribe });
			const path = state.currentPath || '/';

			await fileService.renameItem(oldName, newName, path);
			await this.load(path);
		},

		/* Получить текущий путь синхронно */
		getCurrentPath(): string {
			const state = get({ subscribe });
			return state.currentPath || '/';
		},

		/* Перейти в указанную папку */
		async goTo(path: string) {
			await this.load(path);
		},

		/* Перейти вверх по папкам */
		async goUp() {
			const state = get({ subscribe });
			const parts = state.currentPath.split('/').filter(Boolean);
			parts.pop();
			const path = '/' + parts.join('/');
			await this.load(path || '/');
		}
	};
}

export const fileStore = createFileStore();
