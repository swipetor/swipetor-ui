import httpClient from 'src/utils/httpClient';
import postActions from 'src/redux/actions/postActions';

export default new (class UserActions {
	async follow(followedUserId: number, userFollows: boolean) {
		if (userFollows) {
			await httpClient.post(`/api/users/${followedUserId}/follow`);
		} else {
			await httpClient.delete(`/api/users/${followedUserId}/follow`);
		}

		postActions.userFollows(followedUserId, userFollows);
	}
})();
