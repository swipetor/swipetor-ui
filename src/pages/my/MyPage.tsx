import React, { useEffect } from 'react';
import { useUIStore } from 'src/redux/reduxUtils';
import { setPageTitle } from 'src/utils/windowUtils';
import MyPhoto from './MyPhoto';
import MyProfileDesc from 'src/pages/my/MyProfileDesc';
import DelayedLink from 'src/components/DelayedLink';
import { UserRole } from 'src/types/enums';
import TopLogo from 'src/appshell/TopLogo';

export default function MyPage() {
	const user = useUIStore(state => state.my.user)!;

	useEffect(() => {
		setPageTitle('My Account');
	}, []);

	return (
		<>
			<TopLogo />
			<div className="myPage">
				<h1 style={{ marginTop: 0 }}>
					<span className="material-icons">person</span>
					{user.username}'s Account
				</h1>
				<MyPhoto />
				<MyProfileDesc />
			</div>
			{user.role >= UserRole.Creator && (
				<div className="box">
					<h2>Subscription Plan</h2>
					<p>You can create a subscription plan to monetise your posts.</p>
					<DelayedLink to="/sub-plans" className="mainBtn red block">
						Go to Subscription Plan Settings
					</DelayedLink>
				</div>
			)}

			<p>&nbsp;</p>
		</>
	);
}
