import {
	describe,
	it,
	expect,
	beforeAll,
} from '@jest/globals';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

import Archive from '../src/Archive.js';
import SevenZip from '../src/SevenZip.js';

beforeAll(async () => {
	if (fs.existsSync('tmp')) {
		await fsp.rm('tmp', { recursive: true, force: true });
	}
	await fsp.mkdir('tmp', { recursive: true });
});

const sample = new Archive('tmp/sample.7z');

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
		const reader = await sample.listFiles();
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
		const reader = await sample.listFiles();
		const [files] = await Promise.all([
			reader.list(),
			reader.close(),
		]);
		expect(files).toHaveLength(0);
	});
});

describe('Extracts all files', () => {
	it('extracts all files to a directory', async () => {
		await sample.extract({
			outputDir: 'tmp',
			ignoresDirs: true,
		});
		expect(fs.existsSync('tmp/SevenZip.spec.ts')).toBe(true);
		expect(fs.existsSync('tmp/Archive.spec.ts')).toBe(true);
		await fsp.unlink('tmp/SevenZip.spec.ts');
		await fsp.unlink('tmp/Archive.spec.ts');
	});

	it('extracts all files', async () => {
		const tmpZip = new SevenZip({ executable: '7z', cwd: 'tmp' });
		const archive = new Archive('sample.7z', tmpZip);
		await archive.extract();
		expect(fs.existsSync('tmp/test/SevenZip.spec.ts')).toBe(true);
		expect(fs.existsSync('tmp/test/Archive.spec.ts')).toBe(true);
		await fsp.rm('tmp/test', { recursive: true, force: true });
	});
});
