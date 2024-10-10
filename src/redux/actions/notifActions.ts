import { NotifsMarkReadAction } from 'src/redux/reducers/notifsReducer';
import httpClient from 'src/utils/httpClient';
import store from '../store';
import StateActionType from './stateActionType';
import SmartNotifsFetcher from 'src/redux/actions/libs/SmartNotifsFetcher';

export default new (class NotifActions {
	private notifFetcher = new SmartNotifsFetcher();
	/**
	 * Load notifications from remote
	 */
	async fetchNotifs() {
		await this.notifFetcher.fetchNotifs();
	}
	/**
	 * Marks a notification as read (or unread)
	 * @param notifId
	 * @param isRead
	 */
	async markAsRead(notifId: string, isRead = true) {
		await (isRead ? httpClient.post : httpClient.delete)(`/api/notifs/${notifId}/read`);
		store.dispatch<NotifsMarkReadAction>({
			type: StateActionType.NOTIF_MARK_READ,
			isRead,
			notifId,
		});
	}

	pushNotifGranted(isGranted: boolean) {
		console.log('pushNotifGranted', isGranted);
		store.dispatch({
			isGranted,
			type: StateActionType.NOTIF_PUSH_NOTIF_GRANTED,
		});
	}
})();
