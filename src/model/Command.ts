export const enum Command {
	/**
	 * Add files to archive.
	 */
	Add = 'a',

	/**
	 * Benchmark
	 */
	Benchmark = 'b',

	/**
	 * Delete files from archive
	 */
	Delete = 'd',

	/**
	 * Extract files from archive without directory names
	 */
	ExtractAndFlatten = 'e',

	/**
	 * Calculate hash values for files
	 */
	Hash = 'h',

	/**
	 * Show information about supported formats
	 */
	ShowInformation = 'i',

	/**
	 * List contents of archive.
	 */
	List = 'l',

	/**
	 * Rename files in archive.
	 */
	Rename = 'rn',

	/**
	 * Test integrity of archive.
	 */
	Test = 't',

	/**
	 * Update files to archive.
	 */
	Update = 'u',

	/**
	 * Extract files with full paths.
	 */
	Extract = 'x',
}

export default Command;
