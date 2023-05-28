import { LockName } from './horns';

type HerdName = LockName
type HerdHandler<T = {}> = (event: MessageEvent<T>) => void;

export class Herd<T = {}> {
	private _broadcastChannel: InstanceType<typeof BroadcastChannel>;

	public constructor(name: HerdName) {
		this._broadcastChannel = new BroadcastChannel(name);
	}

	/**
	 * Share data between tabs.s
	 */
	public bellow(data: T): void {
		this._broadcastChannel.postMessage(data);
	}

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
