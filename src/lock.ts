import {
	Bellow,
	Herd,
	HerdHandler,
} from './herd';

/**
 * The name of a lock.
 * It's shared between the tabs and used to determine the master tab.
 */
export type LockName = string;

/**
 * The action that has to be performed only in the master tab.
 */
export type HerdAction<T extends {}> = (bellow: Bellow<T>) => Promise<void>;

export class Lock<T extends {}> {
	private _name: LockName;
	private _herd: Herd<T>;
	private _unlock?: () => void;

	public constructor(name: LockName, herdHandler: HerdHandler<T>) {
		this._name = name;

		this._herd = new Herd<T>(this._name);
		this._herd.setListeningHandler(herdHandler);
	}

	/**
	 * Lock the tabs so only one of them is fetching data
	 * and all the others are getting the data from the fetching one.
	 */
	public async lock(action: HerdAction<T>): Promise<void> {
		const deferredAction = async(): Promise<void> => new Promise(
			async(resolve: () => void) => {
				this.unlock = resolve;

				await action(this._herd.bellow);
			}
		);

		await navigator.locks.request(this._name, deferredAction);
	}

	/**
	 * Release the lock to make each tab independent.
	 * This method is available only after locking.
	 */
	public unlock(): void {
		this._herd?.destroy();

		this._unlock?.();
	}
}
