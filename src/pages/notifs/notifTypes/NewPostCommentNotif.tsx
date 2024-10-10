import { shortenString } from '@atas/weblib-ui-js';
import React from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import { stripTags } from 'src/utils/postUtils';
import BaseNotifType, { GenericNotifProps } from 'src/pages/notifs/notifTypes/BaseNotifType';

export default function NewPostCommentNotif(props: GenericNotifProps) {
	return (
		<BaseNotifType
			photoDiv={<UploadedPhoto isUserPhoto size={64} photo={props.notif.senderUserPhoto} />}
			{...props}
			link={`/p/${props.notif.relatedPostId}`}>
			<>
				<strong>{props.notif.senderUser?.username}</strong> commented at post
				{shortenString(stripTags(props.notif.relatedPost?.title), 30)}"
				<br />
				<em>"{shortenString(stripTags(props.notif.relatedComment?.txt), 60)}"</em>
				<div className="msgInfo"></div>
			</>
		</BaseNotifType>
	);
}
