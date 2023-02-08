import {
	describe,
	it,
	expect,
	beforeAll,
	afterEach,
} from '@jest/globals';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import rimraf from 'rimraf';

import Archive from '../src/Archive';
import SevenZip from '../src/SevenZip';

beforeAll(async () => {
	if (!fs.existsSync('tmp')) {
		await fsp.mkdir('tmp');
	}
});

const zip = new SevenZip({ executable: '7z' });
const sample = new Archive(zip, 'tmp/sample.7z');

describe('Compress a file', () => {
	it('creates a new zip file', async () => {
		await sample.add('test/SevenZip.spec.ts', 'test/Archive.spec.ts');
	});

	it('adds a non-existing file', async () => {
		await sample.add('test/aaa.txt');
	});
});

describe('List files', () => {
	it('has 2 files', async () => {
		const reader = sample.listFiles();
		const files = await reader.list();
		const [file1, file2] = files;
		expect(file1.path).toBe(path.join('test', 'Archive.spec.ts'));
		expect(file2.path).toContain(path.join('test', 'SevenZip.spec.ts'));
		for (const file of files) {
			expect(file.size).not.toBeNaN();
			expect(file.modified.getTime()).not.toBeNaN();
			expect(file.method).toBe('LZMA2:12');
		}
	});

	it('closes reader earlier', async () => {
		const reader = sample.listFiles();
		const [files] = await Promise.all([
			reader.list(),
			reader.close(),
		]);
		expect(files).toHaveLength(0);
	});
});

describe('Extracts all files', () => {
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
