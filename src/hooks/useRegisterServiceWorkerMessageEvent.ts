import { useEffect } from 'react';
import { Logger, LogLevels, SWMsgTypes } from '@atas/webapp-ui-shared';
import pubsub from 'src/libs/pubsub/pubsub';
import store from 'src/redux/store';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from 'src/redux/reduxUtils';

let _swMsgEventRegistered = false;

const useRegisterServiceWorkerMessageEvent = () => {
	const navigate = useNavigate();
	const isPushNotifPermsGranted = useUIStore(state => state.notifs?.isPushNotifGranted);
	const logger = new Logger(useRegisterServiceWorkerMessageEvent, LogLevels.Info);

	useEffect(() => {
		if (_swMsgEventRegistered) return;

		if (
			'serviceWorker' in navigator &&
			navigator.serviceWorker &&
			(isPushNotifPermsGranted || store.getState().notifs?.isPushNotifGranted)
		) {
			_swMsgEventRegistered = true;
			logger.info('Registering ServiceWorker message event listener');

			navigator.serviceWorker.addEventListener('message', event => {
				logger.info('ServiceWorker message received', event);

				if (event.data.type === SWMsgTypes.REDIRECT) {
					logger.info('Redirecting to', event.data.url);
					navigate(event.data.url);
				} else if (event.data.type === SWMsgTypes.REVEAL) {
					const mediaId = parseInt(event.data.mediaId, 10);
					logger.info('Publishing RevealMedia for MediaId:', mediaId);
					pubsub.publish('RevealMedia', { mediaId });
				} else {
					logger.warn('ServiceWorker message type not handled', event);
				}
			});
		}
	}, [isPushNotifPermsGranted, navigate]);
};

export default useRegisterServiceWorkerMessageEvent;
