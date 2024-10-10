import { mentionUtils, prettyDate } from '@atas/weblib-ui-js';
import React, { useState } from 'react';
import DelayedLink from 'src/components/DelayedLink';
import UploadedPhoto from 'src/components/UploadedPhoto';
import { CommentDto } from 'src/types/DTOs';

export default function SingleComment(props: { comment: CommentDto }) {
	const [parsed, setParsed] = useState('');

	const c = props.comment;
	const user = props.comment.user;

	return (
		<div className="singleComment">
			<DelayedLink to={`/u/${user?.id}`} className="userImgLink">
				<UploadedPhoto isUserPhoto size={64} photo={user?.photo} />
			</DelayedLink>
			<div className="txt">
				<DelayedLink to={`/u/${user?.id}`} className="usernameLink">
					{c.user?.username}&nbsp;
				</DelayedLink>
				<span className="createdAt">• {prettyDate(c.createdAt)} ago</span>
				<div>{mentionUtils.formatText(c.txt)}</div>
			</div>
		</div>
	);
}
