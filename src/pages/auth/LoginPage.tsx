import React from 'react';
import LoginPagePopup from 'src/pages/auth/LoginPagePopup';
import { setPageTitle } from 'src/utils/windowUtils';
import TopLogo from 'src/appshell/TopLogo';

export default function LoginPage() {
	setPageTitle('Login');
	return (
		<>
			<TopLogo />
			<div className="topLogoMargin">
				<h2 className="centeredPage">Login Page</h2>

				<br />

				<div className={'box'}>
					<LoginPagePopup />
				</div>
			</div>
		</>
	);
}
