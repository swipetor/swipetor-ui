import StateActionType from 'src/redux/actions/stateActionType';
import store from 'src/redux/store';
import httpClient from 'src/utils/httpClient';
import { NotifsSetAction } from 'src/redux/reducers/notifsReducer';
import { NotifResult } from 'src/types/ApiResponses';

export default class SmartNotifsFetcher {
	private fetchingStarted = 0; // in ms

	async fetchNotifs() {
		if (+new Date() - this.fetchingStarted < 3000) {
			return;
		}

		this.fetchingStarted = +new Date();

		await this.forceFetch();
	}

	async forceFetch() {
		const resp = await httpClient.get<NotifResult>(`/api/notifs`);
		store.dispatch<NotifsSetAction>({
			notifs: resp.data.notifs,
			lastNotifCheckAt: resp.data.lastNotifCheckAt,
			type: StateActionType.NOTIF_SET,
		});
	}
}
