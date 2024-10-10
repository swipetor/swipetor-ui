import StateActionType from 'src/redux/actions/stateActionType';
import store from 'src/redux/store';
import { PmMsgDto, PmThreadDto, UserDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';
import { PmSetMsgListAction, PmThreadListSetAction } from '../../reducers/pmReducer';

export default class SmartPmFetcher {
	private threadFetchingStarted = 0; // in ms
	private msgFetchingStarted = 0; // in ms

	async fetchThreads() {
		if (+new Date() - this.threadFetchingStarted < 3000) return;

		this.threadFetchingStarted = +new Date();

		const result = await httpClient.get<{ threads: PmThreadDto[]; staff: UserDto[] }>(`/api/pm`);
		store.dispatch<PmThreadListSetAction>({
			pmThreadList: result.data.threads,
			staff: result.data.staff,
			type: StateActionType.PM_THREADS_SET,
		});
	}

	async fetchMsgs(threadId: number) {
		const pmState = store.getState().pm;
		if (pmState.activeThread?.id === threadId && +new Date() - this.msgFetchingStarted < 3000) {
			return { msgs: pmState.msgs, thread: pmState.activeThread };
		}

		this.msgFetchingStarted = +new Date();

		store.dispatch<PmSetMsgListAction>({
			pmMsgs: undefined,
			pmThread: undefined,
			type: StateActionType.PM_SET_MSGLIST,
		});

		const [thread, msgs] = await Promise.all([
			httpClient.get<PmThreadDto>(`/api/pm/${threadId}`),
			httpClient.get<PmMsgDto[]>(`/api/pm/${threadId}/msgs?markedRead=true`),
		]);

		store.dispatch<PmSetMsgListAction>({
			pmMsgs: msgs.data.reverse(),
			pmThread: thread.data,
			type: StateActionType.PM_SET_MSGLIST,
		});

		return { msgs: msgs.data, thread: thread.data };
	}
}
