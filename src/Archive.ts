import rl from 'readline';
import ArchiveFileList from './emitter/ArchiveFileList';

import Command from './model/Command';
import type SevenZip from './SevenZip';
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
	 * Extract all files.
	 * @param destination destination folder
	 */
	async extractAll(destination?: string): Promise<void> {
		const child = destination ? this.zip.exec(Command.Extract, `-o${destination}`, this.location) : this.zip.exec(Command.Extract, this.location);
		await join(child);
	}
}

export default Archive;
