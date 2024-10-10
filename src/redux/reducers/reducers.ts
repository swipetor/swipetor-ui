import { Action, combineReducers } from 'redux';
import hub, { HubState } from 'src/redux/reducers/hubReducer';
import appshell, { AppShellState } from './appshellReducer';
import my, { MyState } from './myReducer';
import notifs, { NotifsState } from './notifsReducer';
import pm, { PmState } from './pmReducer';
import { popupsReducer as popups, PopupsState } from '@atas/webapp-ui-shared';
import post, { PostState } from './postReducer';

export interface UIState extends Action {
	my: MyState;
	appshell: AppShellState;
	post: PostState;
	notifs: NotifsState;
	pm: PmState;
	hub: HubState;
	popups: PopupsState;
}

export default combineReducers({
	appshell,
	hub,
	my,
	popups,
	post,
	notifs,
	pm,
});
