import SmartHubsFetcher from './libs/SmartHubsFetcher';

const smartHubsFetcher = new SmartHubsFetcher();

export default {
	async getGlobalHubs() {
		return smartHubsFetcher.fetchHubs();
	},
};
