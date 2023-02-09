export interface ExtractOptions {
	/**
	 * The location where all files are extracted into.
	 * Defaults to working directory.
	 */
	outputDir?: string;

	/**
	 * Whether to extract files without their directory names.
	 * All files will be flattened into output directory.
	 */
	ignoresDirs?: boolean;
}

export default ExtractOptions;
