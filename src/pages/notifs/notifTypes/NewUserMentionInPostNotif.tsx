import React from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import BaseNotifType, { GenericNotifProps } from 'src/pages/notifs/notifTypes/BaseNotifType';
import { shortenString } from '@atas/weblib-ui-js';
import { stripTags } from 'src/utils/postUtils';

export default function NewUserMentionInPostNotif({ notif, lastNotifCheckAt }: GenericNotifProps) {
	return (
		<BaseNotifType
			photoDiv={<UploadedPhoto isUserPhoto size={64} photo={notif.senderUserPhoto} />}
			notif={notif}
			lastNotifCheckAt={lastNotifCheckAt}
			link={`/p/${notif.relatedPostId}`}>
			<>
				<strong>{notif.senderUser?.username}</strong> mentioned you in post: "
				{shortenString(stripTags(notif.relatedPost?.title), 60)}"<div className="msgInfo"></div>
			</>
		</BaseNotifType>
	);
}
