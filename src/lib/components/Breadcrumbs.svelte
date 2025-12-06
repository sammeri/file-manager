<script>
	export let currentPath = '/';
	export let navigate;

	$: segments = currentPath
		.split('/')
		.filter(Boolean)
		.map((name, index, arr) => ({
			name,
			full: '/' + arr.slice(0, index + 1).join('/')
		}));
</script>

<nav class="flex items-center space-x-1 text-sm select-none">
	<button type="button" class="text-blue-600 hover:underline px-1" on:click={() => navigate('/')}>
		root
	</button>

	{#each segments as segment}
		<span class="text-gray-400">/</span>
		<button
			type="button"
			class="text-blue-600 hover:underline px-1"
			on:click={() => navigate(segment.full)}
		>
			{segment.name}
		</button>
	{/each}
</nav>
