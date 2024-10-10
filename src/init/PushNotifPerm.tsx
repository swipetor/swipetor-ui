import React from 'react';
import { Logger, LogLevels, PushNotifPermBase } from '@atas/weblib-ui-js';
import FCM from 'src/init/FCM';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';
import PushNotifAllowTutorial from 'src/pages/others/PushNotifAllowTutorial';
import notifActions from 'src/redux/actions/notifActions';

export default class PushNotifPerm extends PushNotifPermBase {
	constructor() {
		super(FCM, httpClient, popupActions, new Logger(PushNotifPerm, LogLevels.Warn));
	}

	onPushNotifPermResult(isGranted: boolean): void {
		notifActions.pushNotifGranted(isGranted);
	}

	showPushNotifAllowTutorial(): void {
		popupActions.fullScreenPopup({
			children: () => <PushNotifAllowTutorial />,
			isOpen: true,
			title: 'Allow Push Notifications',
		});
	}
}
