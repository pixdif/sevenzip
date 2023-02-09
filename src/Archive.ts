import rl from 'readline';

import type SevenZip from './SevenZip';

import ArchiveFileList from './emitter/ArchiveFileList';

import Command from './model/Command';
import ExtractOptions from './model/ExtractOptions';

import join from './util/join';

export class Archive {
	readonly zip: SevenZip;

	protected location: string;

	constructor(zip: SevenZip, location: string) {
		this.zip = zip;
		this.location = location;
	}

	/**
	 * Add files into the archive.
	 * @param files new files
	 */
	async add(...files: string[]): Promise<void> {
		const child = this.zip.exec(Command.Add, this.location, ...files);
		await join(child);
	}

	/**
	 * List all files in the archive.
	 * @returns archive file list reader
	 */
	listFiles(): ArchiveFileList {
		const child = this.zip.exec(Command.List, '-ba', '-slt', this.location);
		const reader = rl.createInterface({ input: child.stdout });
		return new ArchiveFileList(reader);
	}

	/**
	 * Extract files.
	 * @param options extra options
	 */
	async extract(options?: ExtractOptions): Promise<void> {
		const cmd = options?.ignoresDirs ? Command.ExtractAndFlatten : Command.Extract;
		const args: string[] = [];
		const outputDir = options?.outputDir;
		if (outputDir) {
			args.push(`-o${outputDir}`);
		}
		args.push(this.location);
		const child = this.zip.exec(cmd, ...args);
		await join(child);
	}
}

export default Archive;
