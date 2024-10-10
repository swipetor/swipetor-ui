import { shortenString } from '@atas/weblib-ui-js';
import React from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import { stripTags } from 'src/utils/postUtils';
import BaseNotifType, { GenericNotifProps } from 'src/pages/notifs/notifTypes/BaseNotifType';

export default function NewUserMentionInCommentNotif({ notif, lastNotifCheckAt }: GenericNotifProps) {
	return (
		<BaseNotifType
			photoDiv={<UploadedPhoto isUserPhoto size={64} photo={notif.senderUserPhoto} />}
			lastNotifCheckAt={lastNotifCheckAt}
			notif={notif}
			link={`/p/${notif.relatedPostId}`}>
			<>
				<strong>{notif.senderUser?.username}</strong> mentioned you in comment "
				{shortenString(stripTags(notif.relatedComment?.txt), 60)}"<div className="msgInfo"></div>
			</>
		</BaseNotifType>
	);
}
