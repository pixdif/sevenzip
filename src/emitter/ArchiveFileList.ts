import rl from 'readline';
import { EventEmitter } from 'events';

import ArchiveFile from '../model/ArchiveFile';

export interface ArchiveFileList {
	on(event: 'file', listener: (file: ArchiveFile) => void): this;

	once(event: 'file', listener: (file: ArchiveFile) => void): this;

	off(event: 'file', listener: (file: ArchiveFile) => void): this;

	emit(event: 'file', file: ArchiveFile): boolean;
}

export class ArchiveFileList extends EventEmitter {
	protected reader: rl.Interface;

	protected buffer: Record<string, string> = {};

	constructor(reader: rl.Interface) {
		super();
		this.reader = reader;
		reader.on('line', (line) => this.readLine(line));
	}

	/**
	 * List all files
	 * @returns a list of all files
	 */
	list(): Promise<ArchiveFile[]> {
		return new Promise((resolve, reject) => {
			const list: ArchiveFile[] = [];
			this.on('file', (file) => {
				list.push(file);
			});
			this.reader.once('close', () => {
				resolve(list);
			});
			this.reader.once('error', reject);
		});
	}

	/**
	 * Close the reader.
	 */
	close(): void {
		this.reader.close();
	}

	protected readLine(line: string): void {
		const eq = line.indexOf(' = ');
		if (eq < 0) {
			this.emitFile();
			return;
		}

		const field = line.substring(0, eq);
		const value = line.substring(eq + 3);
		this.buffer[field] = value;
	}

	protected emitFile(): void {
		const { buffer } = this;
		this.buffer = {};

		const file: ArchiveFile = {
			path: buffer.Path,
			size: Number.parseInt(buffer.Size, 10),
			packedSize: Number.parseInt(buffer['Packed Size'], 10),
			modified: new Date(buffer.Modified),
			attributes: buffer.Attributes,
			crc: buffer.CRC,
			encrypted: buffer.Encrypted,
			method: buffer.Method,
			block: Number.parseInt(buffer.Block, 10),
		};
		this.emit('file', file);
	}
}

export default ArchiveFileList;
