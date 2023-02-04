import {
	describe,
	expect,
	it,
} from '@jest/globals';

import SevenZip from '../src/SevenZip';
import join from '../src/util/join';

describe('Define an existing path', () => {
	const zip = new SevenZip();

	it('cannot be used before an executable is found', async () => {
		expect(await zip.isInstalled()).toBe(false);
		expect(() => zip.exec('i')).toThrowError('No executable of 7-Zip is found.');
	});

	it('can find the installed 7-Zip', async () => {
		expect(await zip.findInstalled()).toBe('7z');
		expect(await zip.isInstalled()).toBe(true);
	});

	it('shows supported formats', async () => {
		const child = zip.exec('i');
		await join(child);
	});
});

describe('Locate installed 7-Zip', () => {
	it('locates nothing in the environment', async () => {
		const zip = new SevenZip();
		const cmd = await zip.findInstalled(['a', 'b', 'c']);
		expect(cmd).toBe('');
	});

	it('cannot find non-existing command', async () => {
		const zip = new SevenZip({
			executable: '7zq',
		});
		expect(await zip.isInstalled()).toBe(false);
	});
});
