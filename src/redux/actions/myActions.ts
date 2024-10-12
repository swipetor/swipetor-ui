import { PingAction } from 'src/redux/reducers/appshellReducer';
import store from 'src/redux/store';
import { PingResult } from 'src/types/apiTypes';
import MyApiResponse from 'src/types/MyApiResponse';
import httpClient from 'src/utils/httpClient';
import { MySetAction, MySetUnreadNotifCountAction, MySetUnreadPmCountAction, MyState } from '../reducers/myReducer';
import StateActionType from './stateActionType';
import { Logger, LogLevels } from '@atas/weblib-ui-js';

let onloadCallbacks: ((my: MyState) => void)[] | null = [];

let autoPingToken: ReturnType<typeof setInterval> | null = null;
let autoPingRunAt = 0; // Wrapper ping. It further checks weather to call APIs to refresh data now or later.

export default new (class MyActions {
	logger = new Logger(MyActions, LogLevels.Warn);

	async getMy() {
		const myResult = await httpClient.get<MyApiResponse>('/api/my');
		store.dispatch<MySetAction>({
			...myResult.data,
			loaded: true,
			type: StateActionType.MY_SET,
		});

		// Trigger onload callbacks
		onloadCallbacks && onloadCallbacks.forEach(cb => cb(store.getState().my));
		onloadCallbacks = null;
	}

	setUnreadNotifCount(count: number) {
		store.dispatch<MySetUnreadNotifCountAction>({
			type: StateActionType.MY_SET_UNREAD_NOTIF_COUNT,
			unreadNotifCount: count,
		});
		// await httpClient.put('/api/my/unread-notifs-count', { count });
	}

	setUnreadPmCountLocal(count: number) {
		store.dispatch<MySetUnreadPmCountAction>({
			type: StateActionType.MY_SET_UNREAD_PM_COUNT,
			unreadPmCount: count,
		});
	}

	tryRegisterAutoPing() {
		this.logger.info('Trying to register auto ping handler.');

		const now = new Date().getTime() / 1000;
		if (!autoPingToken || now - autoPingRunAt > 90) {
			this.logger.info(
				`Registering auto-ping. autoPingToken:${autoPingToken}, autoPingLastRun:${now - autoPingRunAt}`,
			);
			autoPingToken && clearInterval(autoPingToken);
			this.autoPing();
			autoPingToken = setInterval(() => this.autoPing(), 60 * 1000);
		}
	}

	onLoaded(cb: (data: MyState) => void) {
		onloadCallbacks === null ? cb(store.getState().my) : onloadCallbacks.push(cb);
	}

	private autoPing() {
		const now = Number(+new Date() / 1000);
		this.logger.info('Auto ping running to check to ping at ' + Number(now));

		if (now - autoPingRunAt <= 50) {
			this.logger.info(`Skipping auto-ping because already ran ${now - autoPingRunAt} seconds ago`);
			return;
		}

		autoPingRunAt = now;

		// Run first
		const hour = 60 * 60;
		const runTimes = [
			{ interval: 60, inactivity: hour }, //every minute up to an hour of inactivity
			{ interval: 60 * 10, inactivity: hour * 48 }, //every 10 mins up to 2 days inactivity
		];

		const lastUrlChangeDelta = now - store.getState().appshell.lastUrlChangeTime;
		const lastPingDelta = now - store.getState().appshell.lastPingTime;

		for (const rt of runTimes) {
			if (lastUrlChangeDelta < rt.inactivity) {
				if (lastPingDelta >= rt.interval) {
					this.ping();
					return;
				}
			}
		}
	}

	private async ping() {
		this.logger.info('Pinging /api/my/ping');
		const pingResult = await httpClient.get<PingResult>('/api/my/ping');

		store.dispatch<PingAction>({
			type: StateActionType.PING,
			ping: pingResult.data,
		});
	}
})();
