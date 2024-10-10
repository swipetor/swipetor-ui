import React from 'react';
import DelayedLink from 'src/components/DelayedLink';
import TopLogo from 'src/appshell/TopLogo';

export default function NotFound() {
	return (
		<React.Fragment>
			<TopLogo />
			<div className="box centeredPage" style={{ textAlign: 'center' }}>
				<h1>Page Not Found 😞</h1>

				<DelayedLink to="/">Return to home page</DelayedLink>
			</div>
		</React.Fragment>
	);
}
