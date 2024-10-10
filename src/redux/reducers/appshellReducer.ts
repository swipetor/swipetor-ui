import { Action } from 'redux';
import StateActionType from 'src/redux/actions/stateActionType';
import { PingResult } from 'src/types/apiTypes';

export interface AppShellState {
	loading: boolean;
	lastUrlChangeTime: number; //updates even if it's the same url
	lastPingTime: number;
	uiVersion?: string;
	showSideMenu: boolean;
}

const initialState: AppShellState = {
	loading: false,
	lastUrlChangeTime: new Date().getTime() / 1000,
	lastPingTime: 0,
	showSideMenu: false,
};

export default function (state = initialState, action: any): AppShellState {
	if (action.type === StateActionType.APPSHELL_LOADING) {
		const a = action as AppshellLoadingAction;
		return { ...state, loading: a.loading };
	}
	if (action.type === StateActionType.APPSHELL_SHOW_SIDEMENU) {
		const a = action as AppshellShowSideMenu;
		return { ...state, showSideMenu: a.showSideMenu };
	}
	if (action.type === StateActionType.APPSHELL_SET_LAST_URL_CHANGE) {
		const a = action as AppshellUpdateLastUrlChangeAction;
		return { ...state, lastUrlChangeTime: a.lastUrlChange };
	}
	if (action.type === StateActionType.PING) {
		const a = action as PingAction;
		return { ...state, uiVersion: a.ping.uiVersion, lastPingTime: new Date().getTime() / 1000 };
	}
	return state;
}

export interface AppshellLoadingAction extends Action<StateActionType.APPSHELL_LOADING> {
	loading: boolean;
	type: StateActionType.APPSHELL_LOADING;
}

export interface AppshellShowSideMenu extends Action<StateActionType.APPSHELL_SHOW_SIDEMENU> {
	showSideMenu: boolean;
	type: StateActionType.APPSHELL_SHOW_SIDEMENU;
}

export interface AppshellUpdateLastUrlChangeAction extends Action<StateActionType.APPSHELL_SET_LAST_URL_CHANGE> {
	lastUrlChange: number;
}

export interface PingAction extends Action<StateActionType.PING> {
	ping: PingResult;
}
