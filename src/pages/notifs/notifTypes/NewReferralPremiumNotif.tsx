import React from 'react';
import BaseNotifType, { GenericNotifProps } from 'src/pages/notifs/notifTypes/BaseNotifType';

export default function NewReferralPremiumNotif({ notif, lastNotifCheckAt }: GenericNotifProps) {
	return (
		<BaseNotifType
			photoDiv={<span className="material-icons-outlined">emoji_events </span>}
			notif={notif}
			lastNotifCheckAt={lastNotifCheckAt}
			link="/">
			<>
				<strong>You received 1-week premium</strong> benefits from referrals you shared. Keep sharing links and
				to keep premium going.
				<br />
				<div className="msgInfo"></div>
			</>
		</BaseNotifType>
	);
}
