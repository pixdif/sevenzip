import {
	describe,
	expect,
	it,
} from '@jest/globals';
import os from 'os';

import SevenZip from '../src/SevenZip';

describe('Define an existing path', () => {
	const PATH = os.platform() === 'win32' ? 'C:\\Program Files\\7-Zip\\' : undefined;
	const zip = new SevenZip({
		env: {
			PATH,
		},
	});

	it('cannot be used before an executable is found', async () => {
		expect(await zip.isInstalled()).toBe(false);
		expect(() => zip.exec('i')).toThrowError('No executable of 7-Zip is found.');
	});

	it('can find the installed 7-Zip', async () => {
		expect(await zip.findInstalled()).toBe('7z');
		expect(await zip.isInstalled()).toBe(true);
	});

	it('shows supported formats', () => {
		const child = zip.exec('i');
		return new Promise((resolve, reject) => {
			child.once('close', resolve);
			child.once('error', reject);
		});
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
