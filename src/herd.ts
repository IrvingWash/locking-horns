import { LockName } from './horns';

/**
 * A function to share data from the master tab
 */
export type Bellow<T extends {}> = (data: T) => void;

/**
 * A function which is triggered in the tabs when the master tab sends new data
 */
export type HerdHandler<T extends {}> = (event: MessageEvent<T>) => void;

type HerdName = LockName

export class Herd<T extends {}> {
	private _broadcastChannel: InstanceType<typeof BroadcastChannel>;

	public constructor(name: HerdName) {
		this._broadcastChannel = new BroadcastChannel(name);
	}

	/**
	 * Share data between the tabs.
	 */
	public bellow: Bellow<T> = (data: T): void => {
		this._broadcastChannel.postMessage(data);
	};

	/**
	 * Set the behavior for tabs that received data.
	 */
	public setListeningHandler(handler: HerdHandler<T>): void {
		this._broadcastChannel.onmessage = handler;
	}

	/**
	 * Destroy the herd.
	 */
	public destroy(): void {
		this._broadcastChannel.close();
	}
}
