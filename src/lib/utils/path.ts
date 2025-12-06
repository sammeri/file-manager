export function joinPath(base: string, name: string): string {
	const cleanBase = base.replace(/\/+$/, ''); // убираем слеши в конце base
	const cleanName = name.replace(/^\/+/, ''); // убираем слеши в начале name

	if (!cleanBase) return `/${cleanName}`; // если base пустой, просто /name
	if (!cleanName) return `/${cleanBase}`; // если name пустой, просто /base

	return `/${cleanBase}/${cleanName}`;
}
