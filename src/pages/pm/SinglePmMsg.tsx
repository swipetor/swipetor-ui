import { mentionUtils, prettyDate } from '@atas/webapp-ui-shared';
import React, { useRef } from 'react';
import DelayedLink from 'src/components/DelayedLink';
import { PmMsgDto, PmThreadDto, UserDto } from 'src/types/DTOs';
import UploadedPhoto from 'src/components/UploadedPhoto';

interface Props {
	msg: PmMsgDto;
	thread: PmThreadDto;
	currentUser: UserDto;
}

const SinglePmMsg: React.FC<Props> = ({ msg, thread, currentUser }) => {
	const contentRef = useRef<HTMLDivElement>(null);

	const isMyPost = () => {
		return currentUser?.id === msg.userId;
	};

	const getClasses = () => {
		const cls = ['singleMsg'];
		cls.push(isMyPost() ? 'myMsg' : 'theirMsg');
		return cls.join(' ');
	};

	const getUser = () => {
		const msgTus = thread.threadUsers?.filter(tu => tu.userId === msg.userId);
		if (!msgTus || msgTus.length === 0) return null;
		return msgTus[0];
	};

	return (
		<div className={`singleMsgWrapper ${isMyPost() ? 'myMsg' : ''}`}>
			<DelayedLink to={`/users/`} className="userImgLink">
				<UploadedPhoto isUserPhoto size={64} photo={getUser()?.user?.photo} />
			</DelayedLink>
			<div className={getClasses()}>
				<DelayedLink to={`/u/${getUser()?.user?.id}`} className="usernameLink">
					{getUser()?.user?.username}
				</DelayedLink>
				<span className="createdAt">• {prettyDate(msg.createdAt)} ago</span>
				<div className="txt">{mentionUtils.formatText(msg.txt)}</div>
			</div>
		</div>
	);
};

export default SinglePmMsg;
