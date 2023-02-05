import {
	describe,
	it,
	expect,
	beforeAll,
	afterEach,
} from '@jest/globals';
import fs from 'fs';
import fsp from 'fs/promises';
import rimraf from 'rimraf';

import Archive from '../src/Archive';
import SevenZip from '../src/SevenZip';

beforeAll(async () => {
	if (!fs.existsSync('tmp')) {
		await fsp.mkdir('tmp');
	}
});

const zip = new SevenZip({ executable: '7z' });

describe('Compress a file', () => {
	const sample = new Archive(zip, 'tmp/sample.7z');

	it('creates a new zip file', async () => {
		await sample.add('test/SevenZip.spec.ts', 'test/Archive.spec.ts');
	});

	it('adds a non-existing file', async () => {
		await sample.add('test/aaa.txt');
	});
});

describe('Extracts all files', () => {
	const sample = new Archive(zip, 'tmp/sample.7z');

	afterEach(async () => {
		await rimraf('tmp/test');
	});

	it('extracts all files to a directory', async () => {
		await sample.extractAll('tmp');
		expect(fs.existsSync('tmp/test/SevenZip.spec.ts')).toBe(true);
		expect(fs.existsSync('tmp/test/Archive.spec.ts')).toBe(true);
	});

	it('extracts all files', async () => {
		const tmpZip = new SevenZip({ executable: '7z', cwd: 'tmp' });
		const archive = new Archive(tmpZip, 'sample.7z');
		await archive.extractAll();
		expect(fs.existsSync('tmp/test/SevenZip.spec.ts')).toBe(true);
		expect(fs.existsSync('tmp/test/Archive.spec.ts')).toBe(true);
	});
});
