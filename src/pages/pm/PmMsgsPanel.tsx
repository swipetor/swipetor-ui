import { detectBrowser, intOrDefault, Logger, LogLevels } from '@atas/weblib-ui-js';
import React, { useEffect, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import DelayedLink from 'src/components/DelayedLink';
import pmActions from 'src/redux/actions/pmActions';
import { useUIStore } from 'src/redux/reduxUtils';
import { setPageTitle } from 'src/utils/windowUtils';
import PmMsgsLoading from './PmMsgsLoading';
import SinglePmMsg from './SinglePmMsg';
import WritePmMsg from './WritePmMsg';
import pmUtils from './pmUtils';

const logger = new Logger(PmMsgsPanel, LogLevels.Info, undefined, () => {});

export default function PmMsgsPanel() {
	const bodyRef = useRef<HTMLDivElement>(null);

	const user = useUIStore(s => s.my.user);
	const { init, ...params } = useParams<{ threadId: string; init?: string }>();
	const threadId = intOrDefault(params.threadId);

	const { activeThread, msgs, currentUser } = useUIStore(
		s => ({
			activeThread: s.pm.activeThread,
			msgs: s.pm.msgs,
			currentUser: s.my.user,
		}),
		shallowEqual,
	);

	useEffect(() => {
		// Load messages when mounting component
		logger.info(`loading msgs by mounting ${threadId}`);
		load();
	}, [params.threadId]);

	useEffect(() => {
		// Load messages when threadId or init changes
		logger.info(`Loading msgs by changed threadId ${threadId} or init ${init}`);
		load();
	}, [params.threadId, init]);

	const load = async () => {
		if (!threadId) return;

		// Fetch active thread and mark as read
		const result = await pmActions.fetchActiveThreadById(threadId);

		if (currentUser && result?.msgs)
			pmActions.markReadLocal(currentUser.id, threadId, result.msgs[result.msgs.length - 1].id);

		// Scroll down after intervals
		[50, 200, 500, 1000, 2000].forEach(t => setTimeout(() => scrollDown(), t));
	};

	const onReplyEditorFocus = () => {
		// Scroll down when editor is focused on mobile
		detectBrowser.isMobile() && [1, 200, 500, 1000].forEach(t => setTimeout(() => scrollDown(), t));
	};

	const scrollDown = () => {
		if (!bodyRef.current) return;
		bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
	};

	const onMsgSent = () => {
		// Scroll down after sending a message
		[50, 200, 500, 1000, 2000].forEach(t => setTimeout(() => scrollDown(), t));
	};

	const receiverUser = () => {
		if (!currentUser) return null;
		return activeThread?.threadUsers?.find(u => u.userId !== currentUser.id);
	};

	const getWritePmRow = () => {
		// Show WritePmMsg component for active threads
		return <WritePmMsg threadId={activeThread!.id} onFocus={onReplyEditorFocus} onSent={onMsgSent} />;
	};

	// Render components based on the state
	// if (!threadId) return <EmptyPmMsgsPanel />;

	if (!activeThread || !msgs || !currentUser) return <PmMsgsLoading />;

	const t = activeThread;
	const threadName = pmUtils.getThreadName(t.threadUsers, false, user?.id) || '';
	setPageTitle('💬 ' + threadName);

	// Render the main component structure
	return (
		<div id="pmMsgsPanel" className="panelColumn">
			<div className="header">
				<div className="headerLeft">
					<DelayedLink
						to="/pm"
						onInstantMobileClick={async e => pmActions.fetchThreads()}
						className="btn iconText">
						<span className="icon material-icons-outlined">arrow_back</span>
						<div className="text">{threadName}</div>
					</DelayedLink>
				</div>
			</div>

			<div ref={bodyRef} className="body">
				{/* Render individual messages */}
				{msgs.map(m => (
					<React.Fragment key={m.id}>
						<SinglePmMsg msg={m} thread={t} currentUser={currentUser!} />
						<div className="clear"></div>
					</React.Fragment>
				))}
			</div>

			{/* Render write message component */}
			<div className="footer">{getWritePmRow()}</div>
		</div>
	);
}
