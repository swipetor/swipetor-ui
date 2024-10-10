import React from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import { shortenString } from '@atas/weblib-ui-js';
import { stripTags } from 'src/utils/postUtils';
import BaseNotifType, { GenericNotifProps } from 'src/pages/notifs/notifTypes/BaseNotifType';

export default function NewPostNotif({ notif, lastNotifCheckAt }: GenericNotifProps) {
	const photoDiv = (
		<div className="photoDiv">
			<UploadedPhoto isUserPhoto size={64} photo={notif.senderUserPhoto} />
		</div>
	);

	return (
		<BaseNotifType
			photoDiv={photoDiv}
			notif={notif}
			lastNotifCheckAt={lastNotifCheckAt}
			link={`/p/${notif.relatedPostId}`}>
			<>
				<strong>{notif.senderUser?.username}</strong> sent a new post
				<br />
				<em>{shortenString(stripTags(notif.relatedPost?.title), 60)}</em>
				<div className="msgInfo"></div>
			</>
		</BaseNotifType>
	);
}
