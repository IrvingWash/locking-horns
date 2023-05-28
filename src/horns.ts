type HornName = string;
type Herd = InstanceType<typeof BroadcastChannel>;
type HerdAction<T> = () => T;

export class Horns<T = {}> {
	private _unlock?: () => void;

	/**
	 * Lock the tabs so only one of them is fetching data
	 * and all the others are getting the data from the fetching one.
	 */
	public async lock(name: HornName, herd: Herd, action: HerdAction<T>): Promise<void> {
		const deferredAction = async(): Promise<void> => new Promise(
			(resolve: () => void) => {
				this.unlock = resolve;

				const data = action();

				herd.postMessage(data);
			}
		);

		await navigator.locks.request(name, deferredAction);
	}

	/**
	 * Create a herd of tabs between which the data will be shared
	 */
	public createHerd(name: HornName): InstanceType<typeof BroadcastChannel> {
		return new BroadcastChannel(name);
	}

	/**
	 * Release the lock to make each tab independent.
	 * This method is available only after locking
	 */
	public unlock(herd: Herd): void {
		herd.close();

		this._unlock?.();
	}
}
