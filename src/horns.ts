import { Herd } from './herd';

export type LockName = string;
export type HerdAction = () => Promise<void>;

export class Horns<T = {}> {
	private _unlock?: () => void;

	/**
	 * Lock the tabs so only one of them is fetching data
	 * and all the others are getting the data from the fetching one.
	 */
	public async lock(name: LockName, action: HerdAction): Promise<void> {
		const deferredAction = async(): Promise<void> => new Promise(
			async(resolve: () => void) => {
				this.unlock = resolve;

				await action();
			}
		);

		await navigator.locks.request(name, deferredAction);
	}

	/**
	 * Release the lock to make each tab independent.
	 * This method is available only after locking.
	 */
	public unlock(herd: Herd<T>): void {
		herd?.destroy();

		this._unlock?.();
	}
}
