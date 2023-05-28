type HornName = string;

export class Horns {
	/**
	 * Release the lock to make each tab independent
	 */
	public unlock?: () => void;

	/**
	 * Lock the tabs so only one of them is fetching data
	 * and all the others are getting the data from the fetching one
	 */
	public async lock(name: HornName, action: () => void): Promise<void> {
		const deferredAction = async(): Promise<void> => new Promise(
			(resolve: () => void) => {
				this.unlock = resolve;

				action();
			}
		);

		await navigator.locks.request(name, deferredAction);
	}
}
