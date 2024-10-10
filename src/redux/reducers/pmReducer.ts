import { Action } from 'redux';
import { PmMsgDto, PmThreadDto, UserDto } from 'src/types/DTOs';
import { Dictionary } from 'ts-essentials';
import { arrayToObject } from '@atas/webapp-ui-shared';
import StateActionType from '../actions/stateActionType';

export interface PmState {
	// All msg threads list
	threadsById: Dictionary<PmThreadDto, number>;

	// Current thread
	activeThread?: PmThreadDto;

	// Current thread's messages
	msgs?: PmMsgDto[];
}

const initialState: PmState = {
	threadsById: {},
};

export default function (state = initialState, action: any): PmState {
	switch (action.type) {
		case StateActionType.PM_SET_MSGLIST: {
			const a = action as PmSetMsgListAction;

			if (a.pmThread) {
				const updatedThreadsById = {
					...state.threadsById,
					[a.pmThread.id]: a.pmThread,
				};
				return {
					...state,
					activeThread: a.pmThread,
					msgs: a.pmMsgs,
					threadsById: updatedThreadsById,
				};
			}

			return state;
		}

		case StateActionType.PM_APPEND_MSG: {
			if (!state.activeThread || !state.msgs) return state;
			const a = action as PmAppendMsgAction;

			if (state.activeThread.id === a.pmMsg.threadId) {
				return {
					...state,
					msgs: [...state.msgs, a.pmMsg],
					threadsById: { ...state.threadsById },
				};
			}

			return state;
		}

		case StateActionType.PM_THREADS_SET: {
			const a = action as PmThreadListSetAction;
			const updatedThreadsById = arrayToObject(a.pmThreadList || [], e => e.id);

			return {
				...state,
				threadsById: updatedThreadsById,
			};
		}

		case StateActionType.PM_THREADS_UPDATE_ONE: {
			if (!state.threadsById) return state;

			const a = action as PmThreadListUpdateOneAction;
			const updatedThread = {
				...state.threadsById[a.threadId],
				...a.threadPartial,
			};
			const updatedThreadsById = {
				...state.threadsById,
				[a.threadId]: updatedThread,
			};

			return {
				...state,
				threadsById: updatedThreadsById,
			};
		}

		case StateActionType.PM_THREAD_MARK_READ_LOCAL: {
			if (!state.threadsById) return state;
			const a = action as PmThreadMarkReadAction;

			const threadUsers = state.threadsById[a.threadId].threadUsers?.map(tu =>
				tu.userId === a.userId
					? { ...tu, unreadMsgCount: 0, lastReadMsgId: a.lastMsgId || tu.lastReadMsgId }
					: tu,
			);

			const updatedThread = {
				...state.threadsById[a.threadId],
				threadUsers,
			};

			return {
				...state,
				threadsById: { ...state.threadsById, [a.threadId]: updatedThread },
			};
		}

		default:
			return state;
	}
}

export interface PmSetMsgListAction extends Action<StateActionType.PM_SET_MSGLIST> {
	pmThread?: PmThreadDto;
	pmMsgs?: PmMsgDto[];
}

export interface PmAppendMsgAction extends Action<StateActionType.PM_APPEND_MSG> {
	pmMsg: PmMsgDto;
}

export interface PmThreadMarkReadAction extends Action<StateActionType.PM_THREAD_MARK_READ_LOCAL> {
	threadId: number;
	userId: number;
	lastMsgId?: number;
}

export interface PmThreadListSetAction extends Action<StateActionType.PM_THREADS_SET> {
	pmThreadList: PmThreadDto[];
	staff: UserDto[];
}

export interface PmThreadListUpdateOneAction extends Action<StateActionType.PM_THREADS_UPDATE_ONE> {
	threadPartial: Partial<PmThreadDto>;
	threadId: number;
}
