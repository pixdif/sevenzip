import cp from 'child_process';

import join from './util/join.js';

async function commandExists(cmd: string, options?: cp.SpawnOptionsWithoutStdio): Promise<boolean> {
	try {
		const child = cp.spawn(cmd, options);
		await join(child);
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
		if (options) {
			const { executable, ...others } = options;
			this.executable = executable;
			this.options = others;
		}
	}

	/**
	 * @returns Executable of 7-Zip.
	 */
	getExecutable(): string | undefined {
		return this.executable;
	}

	/**
	 * Find an installed 7-Zip in the environment.
	 * It looks for 7z, 7zz and 7za by default.
	 * @param executables executable candidates
	 */
	async findInstalled(executables = ['7z', '7zz', '7za']): Promise<void> {
		for (const sevenZip of executables) {
			if (await commandExists(sevenZip, this.options)) {
				this.executable = sevenZip;
			}
		}
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
	 * If the executable isn't set yet, it tries to find an executable first.
	 * @param args command-line arguments
	 */
	async exec(...args: string[]): Promise<cp.ChildProcessWithoutNullStreams> {
		if (!this.executable) {
			await this.findInstalled();
		}
		return this.spawn(...args);
	}

	/**
	 * Spawn a child process with optional arguments.
	 * @param args command-line arguments
	 */
	spawn(...args: string[]): cp.ChildProcessWithoutNullStreams {
		if (!this.executable) {
			throw new Error('No executable of 7-Zip is found.');
		}
		return cp.spawn(this.executable, args, this.options);
	}
}

export default SevenZip;
