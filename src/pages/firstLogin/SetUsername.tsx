import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import myActions from 'src/redux/actions/myActions';
import { UserDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';
import { setPageTitle } from 'src/utils/windowUtils';
import DelayedButton from 'src/components/DelayedButton';

export interface SetUsernameRef {
	submit: () => Promise<void>;
}

function SetUsername(props: { user?: UserDto }, ref: ForwardedRef<SetUsernameRef>) {
	const [username, setUsername] = useState<string>('');
	const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
	const [usernameStatus, setUsernameStatus] = useState<{ available: boolean; error: string } | null>(null);
	const [checkUsernameTimer, setCheckUsernameTimer] = useState<number | null>(null);

	useEffect(() => {
		setPageTitle('Set username');
		props.user && load();
	}, [props.user?.id]);

	const fetchSuggestedUsernames = async () => {
		const [suggestedUsernamesRes] = await Promise.all([httpClient.get('/api/auth/suggest-usernames')]);
		setSuggestedUsernames(suggestedUsernamesRes.data);
	};

	const checkUsernameStatus = async () => {
		const res = await httpClient.post('/api/auth/check-username', { username });
		setUsernameStatus(res.data);
	};

	useEffect(() => {
		fetchSuggestedUsernames();
	}, []);

	useEffect(() => {
		setUsernameStatus(null);
		if (!username || username.length === 0) return;
		checkUsernameTimer && clearTimeout(checkUsernameTimer);
		const timer = setTimeout(async () => checkUsernameStatus(), 1000);
		setCheckUsernameTimer(timer as any);
	}, [username]);

	const load = () => props.user?.username && setUsername(props.user.username);

	useImperativeHandle(ref, () => ({
		submit,
	}));

	const submit = async () => {
		if (props.user?.username) return;

		await httpClient.post('/api/auth/set-username', {
			username: username,
		});
		await myActions.getMy();
	};

	// if (props.user?.username) {
	// 	return <Navigate to={getRedirUrlIfExists(location.search) || '/'} />; //FIXME Redirect to given redirUrl page, if exists
	// }

	return (
		<div className="box centeredPage firstLoginPage">
			<div className="title">Username</div>
			<br />

			<div className="usernameRow">
				<div className="usernameBox">
					<label className="matter-textfield-filled block">
						<input
							value={username}
							placeholder=" "
							disabled={!!props.user?.username}
							onBlur={async () => checkUsernameStatus()}
							onKeyDown={() => setUsernameStatus(null)}
							onChange={e => setUsername(e.target.value)}
						/>
						<span>Username</span>
					</label>
				</div>

				<div className="usernameTick">
					{usernameStatus?.available === true && <span className="material-icons green">check</span>}
					{usernameStatus?.error && <span className="material-icons red">close</span>}
				</div>
			</div>

			{usernameStatus?.error && <div className="helperText">{usernameStatus.error}</div>}

			<br />

			{suggestedUsernames.length > 0 && (
				<>
					Suggestions:
					{suggestedUsernames.map(s => (
						<DelayedButton onDelayedClick={() => setUsername(s)} key={s}>
							{s}
						</DelayedButton>
					))}
					<br />
					<br />
					<div style={{ textAlign: 'center' }}>
						<DelayedButton onDelayedClick={async () => fetchSuggestedUsernames()} className="main white">
							Suggest different
						</DelayedButton>
					</div>
				</>
			)}
		</div>
	);
}

export default forwardRef(SetUsername);
