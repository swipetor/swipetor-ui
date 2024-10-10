import { PmMsgDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';
import store from '../store';
import {
	PmAppendMsgAction,
	PmThreadListUpdateOneAction,
	PmThreadMarkReadAction as PmThreadMarkReadLocalAction,
} from '../reducers/pmReducer';
import SmartPmFetcher from './libs/SmartPmFetcher';
import StateActionType from './stateActionType';

export default new (class PmActions {
	private smartPmFetcher = new SmartPmFetcher();

	async fetchThreads() {
		await this.smartPmFetcher.fetchThreads();
	}

	async fetchActiveThreadById(threadId: number) {
		return this.smartPmFetcher.fetchMsgs(threadId);
	}

	async sendMsg(threadId: number, txt: string) {
		const result = await httpClient.post<PmMsgDto>(`/api/pm/${threadId}/msgs`, { threadId, txt });

		store.dispatch<PmAppendMsgAction>({
			pmMsg: result.data,
			type: StateActionType.PM_APPEND_MSG,
		});

		store.dispatch<PmThreadListUpdateOneAction>({
			threadPartial: {
				lastMsgAt: +new Date() / 1000,
				lastMsg: result.data,
			},
			threadId,
			type: StateActionType.PM_THREADS_UPDATE_ONE,
		});
	}

	markReadLocal(userId: number, threadId: number, lastMsgId: number) {
		store.dispatch<PmThreadMarkReadLocalAction>({
			threadId,
			userId,
			lastMsgId,
			type: StateActionType.PM_THREAD_MARK_READ_LOCAL,
		});
	}
})();
