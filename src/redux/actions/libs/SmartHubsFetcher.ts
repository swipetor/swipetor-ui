import StateActionType from 'src/redux/actions/stateActionType';
import { HubSetAllAction } from 'src/redux/reducers/hubReducer';
import store from 'src/redux/store';
import { HubsApiResp } from 'src/types/apiTypes';
import httpClient from 'src/utils/httpClient';

export default class SmartHubsFetcher {
	private fetchingStarted = 0; // in ms

	async fetchHubs() {
		if (+new Date() - this.fetchingStarted < 3000) {
			return;
		}

		this.fetchingStarted = +new Date();

		await this.forceFetch();
	}

	async forceFetch() {
		const resp = await httpClient.get<HubsApiResp>(`/api/hubs`);
		store.dispatch<HubSetAllAction>({
			hubsById: resp.data.hubsById,
			type: StateActionType.HUB_SET_ALL,
		});
	}
}
