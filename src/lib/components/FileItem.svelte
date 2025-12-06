<script lang="ts">
	import type { FileItem } from '$lib/types';

	export let file: FileItem;
	export let enterFolder: (name: string) => void;
	export let downloadFile: (name: string) => void;
	export let renameItem: (name: string) => void;
	export let deleteFile: (name: string) => void;
</script>

<li
	class="border p-3 rounded shadow-sm hover:shadow-md flex flex-col justify-between bg-white touch-manipulation"
>
	<div class="flex items-center justify-between mb-2">
		<span class="text-lg">{file.isDir ? '📁' : '📄'} {file.name}</span>
		<span class="text-sm text-gray-500">{file.size} bytes</span>
	</div>

	<div class="flex flex-wrap gap-2 mt-auto">
		{#if file.isDir}
			<button
				class="bg-blue-200 px-2 py-1 rounded hover:bg-blue-300 touch-manipulation"
				on:click={() => enterFolder(file.name)}
			>
				Открыть
			</button>
		{:else}
			<button
				class="bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300 touch-manipulation"
				on:click={() => downloadFile(file.name)}
			>
				Скачать
			</button>
		{/if}

		<button
			class="bg-purple-200 px-2 py-1 rounded hover:bg-purple-300 touch-manipulation"
			on:click={() => renameItem(file.name)}
		>
			Переименовать
		</button>

		<button
			class="bg-red-200 px-2 py-1 rounded hover:bg-red-300 touch-manipulation"
			on:click={() => deleteFile(file.name)}
		>
			Удалить
		</button>
	</div>
</li>
