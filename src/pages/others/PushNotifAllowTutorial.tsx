import React from 'react';
import { detectBrowser } from '@atas/weblib-ui-js';
import uiConfig from 'src/init/uiConfig';
import DelayedButton from 'src/components/DelayedButton';
import popupActions from 'src/redux/actions/popupActions';
import IosAddToHomeTutorial from 'src/pages/others/IosAddToHomeTutorial';

export default function PushNotifAllowTutorial() {
	const isIOS = detectBrowser.isiOS();
	const isAndroid = detectBrowser.isAndroid();

	const getTutorial = () => {
		if (isIOS) return iosTut();
		else if (isAndroid) return androidTut();

		return desktopTut();
	};

	return <div className="pushNotifAllowTutorial">{getTutorial()}</div>;
}

function iosTut() {
	const isStandalone = (window.navigator as any).standalone;

	return (
		<>
			<h2>Allow notifications on iPhone/iPad</h2>
			<ul>
				{!isStandalone && (
					<li>
						Ensure you've added the site to home as an app.{' '}
						<DelayedButton
							className="main red"
							onDelayedClick={() =>
								popupActions.fullScreenPopup({
									children: () => <IosAddToHomeTutorial />,
									isOpen: true,
									title: 'Get iOS Push Notifications',
								})
							}>
							See how
						</DelayedButton>
					</li>
				)}
				<li>
					Go to <b>Settings</b> &raquo; scroll to <b>{uiConfig.site.name}</b> &raquo; <b>Notifcations</b>{' '}
					&raquo;
				</li>
				<li>
					Check: <b>Allow Notifications, Lock Screen, Notification Centre, Banners</b>
				</li>
			</ul>
		</>
	);
}

function androidTut() {
	return (
		<>
			<h2>Allow notifications on Android Chrome</h2>
			<img src="/public/tutorials/enable-notifs-chromeandroid-1.jpg" alt="" />
			<br />
			<br />
			<img src="/public/tutorials/enable-notifs-chromeandroid-2.jpg" alt="" />
			<br />
			<br />
			<img src="/public/tutorials/enable-notifs-chromeandroid-3.jpg" alt="" />
			<br />
			<br />
			<img src="/public/tutorials/enable-notifs-chromeandroid-4.jpg" alt="" />
		</>
	);
}

function desktopTut() {
	return (
		<>
			<h2>Allow notifications on Desktop Web</h2>
			<img src="/public/tutorials/enable-notifs-chromeweb.jpg" alt="" />
		</>
	);
}
