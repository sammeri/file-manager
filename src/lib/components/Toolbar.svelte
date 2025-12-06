<script lang="ts">
	export let currentPath: string;
	export let goUp: () => void;
	export let uploadFile: (e: Event) => void;
	export let createFolder: () => void;
</script>

<div class="flex flex-wrap gap-2 mb-4">
	<button
		class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded touch-manipulation"
		on:click={goUp}
		disabled={!currentPath || currentPath === '/'}
	>
		⬆ Назад
	</button>

	<label
		class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 touch-manipulation"
	>
		Загрузить файл
		<input type="file" class="hidden" on:change={uploadFile} />
	</label>

	<button
		class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 touch-manipulation"
		on:click={createFolder}
	>
		Создать папку
	</button>
</div>
