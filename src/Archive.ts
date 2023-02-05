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

	async add(...files: string[]): Promise<void> {
		const child = this.zip.exec(Command.Add, this.location, ...files);
		await join(child);
	}

	async extractAll(destination?: string): Promise<void> {
		const child = destination ? this.zip.exec(Command.Extract, `-o${destination}`, this.location) : this.zip.exec(Command.Extract, this.location);
		await join(child);
	}
}

export default Archive;
