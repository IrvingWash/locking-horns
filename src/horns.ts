import { Herd } from './herd';

export type HornName = string;
export type HerdAction<T> = () => T;

export class Horns<T = {}> {
	private _herd?: Herd<T>;
	private _unlock?: () => void;

	public constructor(name: HornName) {
		this._herd = new Herd<T>(name);
	}

	/**
	 * Lock the tabs so only one of them is fetching data
	 * and all the others are getting the data from the fetching one.
	 */
	public async lock(name: HornName, action: HerdAction<T>): Promise<void> {
		const deferredAction = async(): Promise<void> => new Promise(
			(resolve: () => void) => {
				this.unlock = resolve;

				const data = action();

				this._herd?.bellow(data);
			}
		);

		await navigator.locks.request(name, deferredAction);
	}

	/**
	 * Release the lock to make each tab independent.
	 * This method is available only after locking
	 */
	public unlock(): void {
		this._herd?.destroy();

		this._unlock?.();
	}
}
