import cp from 'child_process';

function spawn(cmd: string, args?: string[], options?: cp.SpawnOptionsWithoutStdio): Promise<void> {
	const child = cp.spawn(cmd, args, options);
	return new Promise((resolve, reject) => {
		child.once('error', reject);
		child.once('close', resolve);
	});
}

async function commandExists(cmd: string, options?: cp.SpawnOptionsWithoutStdio): Promise<boolean> {
	try {
		await spawn(cmd, undefined, options);
		return true;
	} catch (error) {
		return false;
	}
}

interface LaunchOptions extends cp.SpawnOptionsWithoutStdio {
	/**
	 * Executable file path of 7-Zip.
	 */
	executable: string;
}

export class SevenZip {
	protected executable?: string;

	protected options?: cp.SpawnOptionsWithoutStdio;

	/**
	 * Create an instance of 7-Zip.
	 * @param options launch options
	 */
	constructor(options?: Partial<LaunchOptions>) {
		this.executable = options?.executable;
		this.options = options;
	}

	/**
	 * Find an installed 7-Zip in the environment.
	 * It looks for 7z, 7zz and 7za by default.
	 * @param executables executable candidates
	 * @returns command to run 7-Zip
	 */
	async findInstalled(executables = ['7z', '7zz', '7za']): Promise<string> {
		for (const sevenZip of executables) {
			if (await commandExists(sevenZip, this.options)) {
				this.executable = sevenZip;
				return sevenZip;
			}
		}
		return '';
	}

	/**
	 * @returns whether the current command is installed.
	 */
	async isInstalled(): Promise<boolean> {
		if (!this.executable) {
			return false;
		}
		return commandExists(this.executable, this.options);
	}

	/**
	 * Execute with optional arguments.
	 * @param args command-line arguments
	 */
	exec(...args: string[]): cp.ChildProcessWithoutNullStreams {
		if (!this.executable) {
			throw new Error('No executable of 7-Zip is found.');
		}
		return cp.spawn(this.executable, args, this.options);
	}
}

export default SevenZip;
