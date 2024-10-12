import { intOrDefault, shortenString } from '@atas/weblib-ui-js';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router v5+
import DelayedLink from 'src/components/DelayedLink';
import myActions from 'src/redux/actions/myActions';
import pmActions from 'src/redux/actions/pmActions';
import { UIState } from 'src/redux/reducers/reducers';
import { PmThreadDto, UserDto } from 'src/types/DTOs';
import { stripTags } from 'src/utils/postUtils';
import { Dictionary } from 'ts-essentials';
import PmThreadListLoading from './PmThreadsLoading';
import pmUtils from './pmUtils';

interface Props {
	//extends RouteComponentProps<{ threadId?: string; init?: string }> {
	threadsById?: Dictionary<PmThreadDto, number>;
	currentUser?: UserDto;
}

const PmThreadsPanel: React.FC<Props> = () => {
	const threadsById = useSelector((state: UIState) => state.pm.threadsById);
	const currentUser = useSelector((state: UIState) => state.my.user);
	const { init, ...params } = useParams<{ threadId: string; init: string }>();
	const threadId = intOrDefault(params.threadId);

	useEffect(() => {
		load();
	}, [init]);

	const load = () => {
		pmActions.fetchThreads();
		myActions.setUnreadPmCountLocal(0);
	};

	const getMyThreadUser = useCallback(
		(t: PmThreadDto) => {
			return t.threadUsers!.filter(tu => tu.userId == currentUser?.id)[0];
		},
		[threadsById],
	);

	const threadComponent = useCallback(
		(t: PmThreadDto) => {
			const myThreadUser = getMyThreadUser(t);

			return (
				<React.Fragment key={t.id}>
					<DelayedLink
						to={`/pm/${t.id}`}
						className={getThreadStyleClass(t)}
						onInstantMobileClick={async () => pmActions.fetchActiveThreadById(t.id)}>
						{myThreadUser.unreadMsgCount > 0 && (
							<span className="unreadBalloon">{myThreadUser.unreadMsgCount}</span>
						)}
						<div className="iconCol">
							<span className={`material-icons${myThreadUser?.unreadMsgCount === 0 ? '-outlined' : ''}`}>
								email{' '}
							</span>
						</div>
						<div className="textCol">
							<div className="name">{pmUtils.getThreadName(t.threadUsers, true, currentUser?.id)}</div>
							<div className="lastMsg">{shortenString(stripTags(t.lastMsg?.txt), 100)}</div>
							{/* <div className="desc">{channel.description}</div> */}
						</div>
					</DelayedLink>
				</React.Fragment>
			);
		},
		[getMyThreadUser, currentUser],
	);

	const orderedThreads =
		useMemo(() => {
			if (!threadsById) return null;
			return Object.values(threadsById!).sort((t1, t2) => t2.lastMsgAt - t1.lastMsgAt);
		}, [threadsById]) || [];

	const getThreadStyleClass = useCallback(
		(thread: PmThreadDto) => {
			const cls = ['panelBtn'];

			if (thread.id === threadId) {
				cls.push('selected');
			}

			if (thread.unreadMsgCount > 0) {
				cls.push('read');
			}

			return cls.join(' ');
		},
		[threadId],
	);

	if (!threadsById || !currentUser) return null;

	return (
		<div className="panelColumn pmThreadsPanel">
			<div className="header">
				<div className="headerLeft">
					<div className="title">Private Messages</div>
				</div>
				<div className="headerRight">
					<DelayedLink to="/pm/new" className="mainBtn red block">
						New PM
					</DelayedLink>
				</div>
			</div>

			<div className="body">
				{/* TODO: Enable new private message link */}
				{/* <DelayedLink to={`#`} onClick={() => popupUtils.openNewPmDialog()} className="panelBtn"> */}
				{/* 	<div className="iconCol"> */}
				{/* 		<span className="material-icons-outlined">create </span> */}
				{/* 	</div> */}
				{/* 	<div className="textCol"> */}
				{/* 		<div className="name">New Private Message</div> */}
				{/* 	</div> */}
				{/* </DelayedLink> */}
				{!threadsById && <PmThreadListLoading />}
				{orderedThreads.map(t => threadComponent(t))}

				{orderedThreads.length === 0 && (
					<React.Fragment>
						<p style={{ textAlign: 'center' }}>No threads, yet.</p>
						<p style={{ textAlign: 'center' }}>You can contact content creators through their posts.</p>
					</React.Fragment>
				)}
			</div>
			<div className="footer">
				{/* <DelayedLink to="/all-hubs" className="mainBtn block"> */}
				{/* 	<div className="icon material-icons-outlined">star_border</div> */}
				{/* 	<div className="text">All Channels ({totalChannelsCnt})</div> */}
				{/* </DelayedLink> */}
			</div>
		</div>
	);
};

export default PmThreadsPanel;
