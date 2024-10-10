import {
	AppshellLoadingAction,
	AppshellShowSideMenu,
	AppshellUpdateLastUrlChangeAction,
} from 'src/redux/reducers/appshellReducer';
import store from 'src/redux/store';
import StateActionType from './stateActionType';

const loadingStack: Record<string, never>[] = [];

export default {
	/**
	 * Sets the loading status of the window and shows a loading indicator if loading
	 * It can handle multiple requests like a stack for loading start and finish events
	 * @param status
	 */
	loading: (status: boolean) => {
		status ? loadingStack.push({}) : loadingStack.pop();

		store.dispatch<AppshellLoadingAction>({
			type: StateActionType.APPSHELL_LOADING,
			loading: loadingStack.length > 0,
		});
	},

	sideMenu(show: boolean) {
		store.dispatch<AppshellShowSideMenu>({
			showSideMenu: show,
			type: StateActionType.APPSHELL_SHOW_SIDEMENU,
		});
	},

	updateLastUrlChange() {
		store.dispatch<AppshellUpdateLastUrlChangeAction>({
			lastUrlChange: Math.floor(+new Date() / 1000),
			type: StateActionType.APPSHELL_SET_LAST_URL_CHANGE,
		});
	},
};
