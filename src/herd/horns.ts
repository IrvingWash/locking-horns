import {
	HerdAction,
	HornLock,
	HornLockImpl,
	LockName,
} from './lock';

import { Bellow, HerdHandler } from './herd';

/**
 * Horns are a herd of tabs that are going to be locked.
 */
export class Horns<T extends {}> {
	private readonly _herdHandler: HerdHandler<T>;
	private readonly _herdAction: HerdAction<T>;
	private readonly _hornLock: HornLock<T>;

	public constructor(name: LockName, herdHandler: HerdHandler<T>, herdAction: HerdAction<T>) {
		this._herdAction = herdAction;
		this._herdHandler = herdHandler;
		this._hornLock = new HornLockImpl(name, this._herdHandler);
	}

	/**
	 * Lock the horns.
	 * Create a master tab to do a resourceful action and share
	 * the received data between the herd.
	 */
	public lock = async(): Promise<void> => {
		return await this._hornLock.lock(this._herdAction);
	};

	/**
	 * Unlock the horns.
	 * Let the tabs be independent.
	 */
	public unlock = (): void => {
		return this._hornLock.unlock();
	};

	/**
	 * A function that is called every time a tab receives new data from the master tab.
	 */
	public herdHandler = (event: MessageEvent<T>): void => {
		return this._herdHandler(event);
	};

	/**
	 * A function that shares new data from the master tab.
	 */
	public herdAction = async(bellow: Bellow<T>): Promise<void> => {
		return await this._herdAction(bellow);
	};
}
