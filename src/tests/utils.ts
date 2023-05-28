import { join } from 'path';

export function openLocalPage(): string {
	const path = join(__dirname, 'test-app', 'index.html');

	return `file://${path}`;
}
