import React from 'react';
import DelayedLink from 'src/components/DelayedLink';
import { NotifDto } from 'src/types/DTOs';
import notifActions from 'src/redux/actions/notifActions';
import { Logger, LogLevels, prettyDate } from '@atas/weblib-ui-js';

interface BaseNotifProps extends GenericNotifProps {
	photoDiv: React.ReactNode;
	link: string;
	children?: React.ReactNode;
}

export interface GenericNotifProps {
	notif: NotifDto;
	lastNotifCheckAt?: number | null;
}

export default function BaseNotifType(props: BaseNotifProps) {
	const logger = new Logger(BaseNotifType, LogLevels.Info);

	const notifItemClass = () => {
		const cls = ['btn singleNotif'];
		cls.push(props.notif.isRead ? 'read' : 'unread');
		if (!props.lastNotifCheckAt || props.notif.createdAt > props.lastNotifCheckAt) {
			logger.info('Highlighting notif', props.lastNotifCheckAt, props.notif.createdAt, props.notif);
			cls.push('highlight');
		}
		return cls.join(' ');
	};

	return (
		<DelayedLink
			to={props.link}
			onClick={_ => {
				notifActions.markAsRead(props.notif.id, true);
			}}
			className={notifItemClass()}>
			<div className="photoDiv">{props.photoDiv}</div>
			<div className="textDiv">
				{props.children}

				<div className="dateTime">
					<span>{prettyDate(props.notif.createdAt)} ago</span>
				</div>
			</div>
			<div className="actionBtns">
				<button
					onClick={async e => {
						e.preventDefault();
						notifActions.markAsRead(props.notif.id, !props.notif.isRead);
					}}
					className="markReadBtn">
					<span className="material-icons-outlined">visibility </span>
				</button>
			</div>
		</DelayedLink>
	);
}
