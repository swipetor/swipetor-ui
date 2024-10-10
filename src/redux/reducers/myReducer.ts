import { Action } from 'redux';
import StateActionType from 'src/redux/actions/stateActionType';
import { UserDto } from 'src/types/DTOs';
import { PingAction } from './appshellReducer';

export interface MyState {
	user?: UserDto;
	locations: Location[];
	ipCountry: any | null;
	loaded: boolean;
	isLoggedIn: boolean | null;
	unreadNotifCount: number;
	unreadPmCount: number;
}

const initialState: MyState = {
	ipCountry: null,
	loaded: false,
	locations: [],
	// If null, not loaded yet, if false, not logged in (guest), if true, logged in
	isLoggedIn: null,
	unreadNotifCount: 0,
	unreadPmCount: 0,
};

export default function (state = initialState, action: any): MyState {
	if (action.type === StateActionType.MY_SET) {
		const a = action as MySetAction;
		return {
			...state,
			user: a.user,
			loaded: a.loaded,
			isLoggedIn: !!action.user,
		};
	}
	// Set unread notif count
	else if (action.type === StateActionType.MY_SET_UNREAD_NOTIF_COUNT) {
		if (!state.user) return state;
		const a = action as MySetUnreadNotifCountAction;
		return { ...state, unreadNotifCount: a.unreadNotifCount };
	}
	// Ping
	else if (action.type === StateActionType.PING) {
		const a = action as PingAction;
		if (!state.user) return state;
		return {
			...state,
			user: { ...a.ping.user },
			unreadNotifCount: a.ping.unreadNotifCount ?? 1,
			unreadPmCount: a.ping.unreadPmCount ?? 0,
		};
	}
	// Set Unread PM count
	else if (action.type === StateActionType.MY_SET_UNREAD_PM_COUNT) {
		if (!state.user) return state;
		const a = action as MySetUnreadPmCountAction;
		return { ...state, unreadPmCount: a.unreadPmCount };
	}

	return state;
}

export interface MySetAction extends Action<StateActionType.MY_SET> {
	user?: UserDto;
	loaded: boolean;
}

export interface MySetUnreadNotifCountAction extends Action<StateActionType.MY_SET_UNREAD_NOTIF_COUNT> {
	unreadNotifCount: number;
}

export interface MySetUnreadPmCountAction extends Action<StateActionType.MY_SET_UNREAD_PM_COUNT> {
	unreadPmCount: number;
}
