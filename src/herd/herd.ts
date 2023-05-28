import { LockName } from './lock';

/**
 * A function that shares data from the master tab.
 */
export type Bellow<T extends {}> = (data: T) => void;

/**
 * A function which is triggered in the tabs when the master tab sends new data.
 */
export type HerdHandler<T extends {}> = (event: MessageEvent<T>) => void;

/**
 * A herd of tabs that share date together.
 */
export interface Herd<T extends {}> {
	/**
	 * Share data between the tabs.
	 */
	bellow: Bellow<T>;

	/**
	 * Set the behavior for tabs that received data.
	 */
	setListeningHandler(handler: HerdHandler<T>): void;

	/**
	 * Destroy the herd.
	 */
	destroy(): void;
}

type HerdName = LockName

export class HerdImpl<T extends {}> implements Herd<T> {
	private _broadcastChannel: InstanceType<typeof BroadcastChannel>;

	public constructor(name: HerdName) {
		this._broadcastChannel = new BroadcastChannel(name);
	}

	public bellow: Bellow<T> = (data: T): void => {
		this._broadcastChannel.postMessage(data);
	};

	public setListeningHandler(handler: HerdHandler<T>): void {
		this._broadcastChannel.onmessage = handler;
	}

	public destroy(): void {
		this._broadcastChannel.close();
	}
}
