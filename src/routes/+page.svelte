<script lang="ts">
	import { onMount } from 'svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import FileList from '$lib/components/FileList.svelte';
	import { fileStore } from '$lib/stores/fileStore';
	import { joinPath } from '$lib/utils/path';

	import type { FileItem } from '$lib/types';

	let files: FileItem[] = [];
	let currentPath = '/';

	// store
	const unsubscribe = fileStore.subscribe((state) => {
		files = state.files;
		currentPath = state.currentPath;
	});

	onMount(() => {
		fileStore.load();
		return () => unsubscribe();
	});

	// методы store
	const handleUpload = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (!input.files || !input.files[0]) return;
		fileStore.upload(input.files[0]);
	};

	const handleCreateFolder = () => {
		const folderName = prompt('Название новой папки:');
		if (!folderName) return;
		fileStore.createFolder(folderName);
	};

	const handleDelete = (name: string) => fileStore.delete(name);
	const handleDownload = (name: string) => fileStore.download(name);
	const handleRename = (name: string) => {
		const newName = prompt('Новое имя:', name);
		if (!newName || newName === name) return;
		fileStore.rename(name, newName);
	};

	const navigate = (path: string) => fileStore.goTo(path);
	const enterFolder = (name: string) => {
		const path = joinPath(currentPath, name);
		fileStore.goTo(path);
	};
	const goUp = () => fileStore.goUp();
</script>

<div class="max-w-6xl mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4 text-center">Файловый менеджер</h1>

	<Toolbar {currentPath} {goUp} uploadFile={handleUpload} createFolder={handleCreateFolder} />
	<Breadcrumbs {currentPath} {navigate} />
	<FileList
		{files}
		{enterFolder}
		downloadFile={handleDownload}
		renameItem={handleRename}
		deleteFile={handleDelete}
	/>
</div>
