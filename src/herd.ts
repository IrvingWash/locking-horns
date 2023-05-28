import { HornName } from './horns';

type HerdName = HornName
type HerdHandler<T = {}> = (event: MessageEvent<T>) => void;

export class Herd<T = {}> {
	private _broadcastChannel: InstanceType<typeof BroadcastChannel>;

	public constructor(name: HerdName) {
		this._broadcastChannel = new BroadcastChannel(name);
	}

	public bellow(data: T): void {
		this._broadcastChannel.postMessage(data);
	}

	public setListeningHandler(handler: HerdHandler<T>): void {
		this._broadcastChannel.onmessage = handler;
	}

	public destroy(): void {
		this._broadcastChannel.close();
	}
}
