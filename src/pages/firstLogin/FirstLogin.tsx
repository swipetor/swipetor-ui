import { getRedirUrlIfExists } from '@atas/weblib-ui-js';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';
import SetUsername, { SetUsernameRef } from 'src/pages/firstLogin/SetUsername';
import { useUIStore } from 'src/redux/reduxUtils';
import popupActions from 'src/redux/actions/popupActions';
import TopLogo from 'src/appshell/TopLogo';

export default function FirstLogin() {
	const user = useUIStore(state => state.my.user);
	const usernameRef = useRef<SetUsernameRef>(null);

	const navigate = useNavigate();

	async function submit() {
		await usernameRef.current?.submit();
		popupActions.snackbarMsg('Saved. Enjoy the app.');
		navigate(getRedirUrlIfExists() || '/');
	}

	const username = user?.username;
	return (
		<>
			<TopLogo />
			<div className="topLogoMargin">
				<h2 className="centeredPage">Let's start{username ? ' ' + username : ''}</h2>
				<SetUsername ref={usernameRef} user={user} />

				<div className="box centeredPage">
					<DelayedButton onDelayedClick={async () => submit()} className="main block">
						Continue ➡
					</DelayedButton>
				</div>
			</div>
		</>
	);
}
