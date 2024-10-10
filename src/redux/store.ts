import reducers from './reducers/reducers';
import { configureStore } from '@reduxjs/toolkit';
import { PopupsActionType } from '@atas/weblib-ui-js';

const store = configureStore({
	reducer: reducers,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: [
					PopupsActionType.POPUPS_MSG,
					PopupsActionType.POPUPS_GLOBAL_SLIDING_POPUP,
					PopupsActionType.POPUPS_GLOBAL_POPUP_BASE,
					PopupsActionType.POPUPS_SNACKBAR,
					PopupsActionType.POPUPS_FULLSCREEN,
				],
				// // Ignore these field paths in all actions
				// ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
				// Ignore these paths in the state
				ignoredPaths: ['popups'],
			},
		}),
});

export default store;
