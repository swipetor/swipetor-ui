import qs from 'query-string';
import { PostsGetApiResp } from 'src/types/ApiResponses';
import httpClient from 'src/utils/httpClient';

export default class SmartPostsFetcher {
	private fetchingStarted = 0; // in ms
	private fetchingUrl?: string;

	async fetchByTopicId(topicId: number, fromPostId?: number, afterPostId?: number, afterTime?: number) {
		const fetchingUrl = `/api/topics/${topicId}/posts?` + qs.stringify({ afterPostId, fromPostId, afterTime });

		if (fetchingUrl === this.fetchingUrl && +new Date() - this.fetchingStarted < 3000) {
			return;
		}

		this.fetchingStarted = +new Date();
		this.fetchingUrl = fetchingUrl;

		const postResult = await httpClient.get<PostsGetApiResp>(fetchingUrl);
		const resultData = postResult.data;

		return resultData;
	}
}
