import { Bellow, HerdHandler } from './herd';
import { HerdAction, Lock, LockName } from './lock';

export class Horns<T extends {}> {
	private readonly _herdHandler: HerdHandler<T>;
	private readonly _herdAction: HerdAction<T>;
	private readonly _lock: Lock<T>;

	public constructor(name: LockName, herdHandler: HerdHandler<T>, herdAction: HerdAction<T>) {
		this._herdAction = herdAction;
		this._herdHandler = herdHandler;
		this._lock = new Lock(name, this._herdHandler);
	}

	public lock = async(): Promise<void> => {
		return await this._lock.lock(this._herdAction);
	};

	public unlock = (): void => {
		return this._lock.unlock();
	};

	public herdHandler = (event: MessageEvent<T>): void => {
		return this._herdHandler(event);
	};

	public herdAction = async(bellow: Bellow<T>): Promise<void> => {
		return await this._herdAction(bellow);
	};
}
