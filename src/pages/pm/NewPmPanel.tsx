import React, { useMemo, useState } from 'react';
import UserSelect from 'src/components/UserSelect';
import { UserRole } from 'src/types/enums';
import DelayedButton from 'src/components/DelayedButton';
import httpClient from 'src/utils/httpClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { intOrDefault } from '@atas/weblib-ui-js';
import pmActions from 'src/redux/actions/pmActions';
import DelayedLink from 'src/components/DelayedLink';

export default function NewPmPanel() {
	const [users, setUsers] = useState<number[]>([]);
	const navigate = useNavigate();
	const location = useLocation();

	const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
	const userIds = useMemo(
		() =>
			(queryParams.get('userIds') || '')
				.split(',')
				.filter(u => u.length > 0)
				.map(u => intOrDefault(u, 0)),
		[queryParams],
	);

	const handleStartThread = async () => {
		const resp = await httpClient.post<number>('/api/pm/init', { userIds: users, txt: '' });
		resp.data && navigate(`/pm/${resp.data}`);
	};

	return (
		<div id="newPmPanel" className="panelColumn">
			<div className="header">
				<DelayedLink to="/pm" onInstantMobileClick={async e => pmActions.fetchThreads()} className="btn block">
					<span className="icon material-icons-outlined">arrow_back</span>
					&nbsp;
					<div className="text">New PM</div>
				</DelayedLink>
			</div>
			<div className="body">
				<br />
				<UserSelect minRole={UserRole.Default} isMulti onChange={setUsers} defaultUserIds={userIds} />

				<br />
				<div className="box" style={{ paddingBottom: 10 }}>
					<p>You can only create a thread with: </p>
					<ul>
						<li>Users who follow you</li>
						<li>Or who have commented on your posts within the last 7 days.</li>
						<li>Max 4 users can be in a thread.</li>
					</ul>
				</div>
			</div>
			<div className="footer">
				<DelayedButton onDelayedClick={async () => handleStartThread()} className="mainBtn block">
					Start Thread
				</DelayedButton>
			</div>
		</div>
	);
}
