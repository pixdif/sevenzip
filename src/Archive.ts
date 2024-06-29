import rl from 'readline';

import SevenZip from './SevenZip.js';

import ArchiveFileList from './emitter/ArchiveFileList.js';

import Command from './model/Command.js';
import ExtractOptions from './model/ExtractOptions.js';

import join from './util/join.js';

export class Archive {
	readonly zip: SevenZip;

	protected location: string;

	constructor(location: string, zip = new SevenZip()) {
		this.zip = zip;
		this.location = location;
	}

	/**
	 * Add files into the archive.
	 * @param files new files
	 */
	async add(...files: string[]): Promise<void> {
		const child = await this.zip.exec(Command.Add, this.location, ...files);
		await join(child);
	}

	/**
	 * List all files in the archive.
	 * @returns archive file list reader
	 */
	async listFiles(): Promise<ArchiveFileList> {
		const child = await this.zip.exec(Command.List, '-ba', '-slt', this.location);
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
		const child = await this.zip.exec(cmd, ...args);
		await join(child);
	}
}

export default Archive;
