export interface ArchiveFile {
	/**
	 * File path in the archive.
	 */
	path: string;

	/**
	 * File size
	 */
	size: number;

	/**
	 * Packed size
	 */
	packedSize: number;

	/**
	 * Modified time
	 */
	modified: Date;

	/**
	 * Attributes
	 */
	attributes: string;

	/**
	 * Cyclic redundancy check
	 */
	crc: string;

	/**
	 * Encrypted
	 */
	encrypted: string;

	/**
	 * Compress method
	 */
	method: string;

	/**
	 * Block
	 */
	block: number;
}

export default ArchiveFile;
