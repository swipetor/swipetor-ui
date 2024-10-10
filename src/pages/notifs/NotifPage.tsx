import { Logger, LogLevels } from '@atas/webapp-ui-shared';
import React, { useEffect } from 'react';
import myActions from 'src/redux/actions/myActions';
import notifActions from 'src/redux/actions/notifActions';
import { UIState } from 'src/redux/reducers/reducers';
import { useUIStore } from 'src/redux/reduxUtils';
import { NotifType } from 'src/types/enums';
import { setPageTitle } from 'src/utils/windowUtils';
import NotifLoading from './NotifLoading';
import NewPostCommentNotifItem from 'src/pages/notifs/notifTypes/NewPostCommentNotif';
import NewUserMentionInCommentNotif from 'src/pages/notifs/notifTypes/NewUserMentionInCommentNotif';
import { shallowEqual } from 'react-redux';
import NewReferralPremiumNotif from 'src/pages/notifs/notifTypes/NewReferralPremiumNotif';
import NewPostNotif from 'src/pages/notifs/notifTypes/NewPostNotif';
import TopLogo from 'src/appshell/TopLogo';

export default function NotifPage() {
	const logger = new Logger(NotifPage, LogLevels.Info);
	const { notifs, lastNotifCheckAt } = useUIStore(
		(state: UIState) => ({
			notifs: state.notifs.notifs,
			lastNotifCheckAt: state.notifs.lastNotifCheckAt,
		}),
		shallowEqual,
	);
	useEffect(() => {
		setPageTitle('Notifications');
		myActions.setUnreadNotifCount(0);
		notifActions.fetchNotifs();
	}, []);

	if (!notifs) return <NotifLoading />;

	logger.info('Rendering notifs', lastNotifCheckAt, notifs);

	return (
		<>
			<TopLogo />
			<h1>
				<span className="material-icons">email</span> Notifications
			</h1>
			<div className="notifPage box centeredPage">
				{notifs.length === 0 && (
					<div>
						<p>You don't have any notifications, yet. Interact on the website and you will get some!</p>
					</div>
				)}
				{notifs.map(n => (
					<div key={n.id}>
						{n.type === NotifType.NewComment && (
							<NewPostCommentNotifItem notif={n} lastNotifCheckAt={lastNotifCheckAt} />
						)}
						{n.type === NotifType.NewPost && <NewPostNotif notif={n} lastNotifCheckAt={lastNotifCheckAt} />}
						{n.type === NotifType.UserMentionInComment && (
							<NewUserMentionInCommentNotif notif={n} lastNotifCheckAt={lastNotifCheckAt} />
						)}
						{n.type === NotifType.NewReferralPremium && (
							<NewReferralPremiumNotif notif={n} lastNotifCheckAt={lastNotifCheckAt} />
						)}
						<span className="baseNotifFadingLine"></span>
					</div>
				))}
			</div>
		</>
	);
}
