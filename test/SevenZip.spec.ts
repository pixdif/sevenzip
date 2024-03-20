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
		expect(() => zip.spawn('i')).toThrowError('No executable of 7-Zip is found.');
	});

	it('can find the installed 7-Zip', async () => {
		await zip.findInstalled();
		expect(zip.getExecutable()).not.toBeUndefined();
		expect(await zip.isInstalled()).toBe(true);
	});

	it('shows supported formats', async () => {
		const child = zip.spawn('i');
		await join(child);
	});
});

describe('Locate installed 7-Zip', () => {
	it('tries multiple executables by default', async () => {
		const zip = new SevenZip();
		const child = await zip.exec('i');
		await join(child);
	});

	it('locates nothing in the environment', async () => {
		const zip = new SevenZip();
		await zip.findInstalled(['a', 'b', 'c']);
		expect(zip.getExecutable()).toBeUndefined();
	});

	it('cannot find non-existing command', async () => {
		const zip = new SevenZip({
			executable: '7zq',
		});
		expect(await zip.isInstalled()).toBe(false);
	});
});
