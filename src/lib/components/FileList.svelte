<script lang="ts">
	import FileItem from './FileItem.svelte';
	import type { FileItem as FileItemType } from '$lib/types';

	export let files: FileItemType[] = [];
	export let enterFolder: (name: string) => void;
	export let downloadFile: (name: string) => void;
	export let renameItem: (name: string) => void;
	export let deleteFile: (name: string) => void;
</script>

<ul class="grid grid-cols-1 gap-4">
	{#each files as file}
		<FileItem {file} {enterFolder} {downloadFile} {renameItem} {deleteFile} />
	{/each}
</ul>
