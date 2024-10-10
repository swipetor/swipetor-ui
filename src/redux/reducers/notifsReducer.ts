import { Action } from 'redux';
import StateActionType from 'src/redux/actions/stateActionType';
import { NotifDto } from 'src/types/DTOs';
import FCM from 'src/init/FCM';

export interface NotifsState {
	notifs?: NotifDto[];
	lastNotifCheckAt?: number;
	isPushNotifGranted: boolean;
}

const initialState: NotifsState = {
	isPushNotifGranted: FCM.isGranted(),
};

console.log('Debug: notifsReducer.ts', initialState);

export default function (state = initialState, action: any): NotifsState {
	if (action.type === StateActionType.NOTIF_SET) {
		const a = action as NotifsSetAction;
		return {
			...state,
			notifs: a.notifs,
			lastNotifCheckAt: a.lastNotifCheckAt,
		};
	} else if (action.type === StateActionType.NOTIF_MARK_READ) {
		if (!state.notifs) return state;
		const a = action as NotifsMarkReadAction;

		// Create a new array with modifications only to the relevant notification
		const updatedNotifs = state.notifs.map(notif => {
			if (notif.id === a.notifId) {
				// Return a new object with the isRead property updated
				return {
					...notif,
					isRead: a.isRead,
				};
			}
			return notif;
		});

		// Return the updated state
		return {
			...state,
			notifs: updatedNotifs,
		};
	} else if (action.type === StateActionType.NOTIF_PUSH_NOTIF_GRANTED) {
		const a = action as NotifsPushNotifGrantedAction;
		return {
			...state,
			isPushNotifGranted: a.isGranted,
		};
	}

	return state;
}

export interface NotifsSetAction extends Action<StateActionType.NOTIF_SET> {
	notifs?: NotifDto[];
	lastNotifCheckAt?: number;
}

export interface NotifsMarkReadAction extends Action<StateActionType.NOTIF_MARK_READ> {
	isRead: boolean;
	notifId: string;
}

export interface NotifsPushNotifGrantedAction extends Action<StateActionType.NOTIF_PUSH_NOTIF_GRANTED> {
	isGranted: boolean;
}
