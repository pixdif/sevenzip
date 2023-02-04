import cp from 'child_process';

/**
 * Wait until the child process is finished.
 * @param child child process
 */
function join(child: cp.ChildProcess): Promise<void> {
	return new Promise((resolve, reject) => {
		child.once('error', reject);
		child.once('close', resolve);
	});
}

export default join;
