import React from 'react';
import uiConfig from 'src/init/uiConfig';
import SwipeUpTutorialText from 'src/post/SwipeUpTutorialText';

export default function WelcomePost() {
	return (
		<div className="welcomePostDiv">
			<img
				className="logo"
				src="https://local.swipetor.com:8443/public/swipetor/logo-underlined-slim-256.png"
				alt="Logo"
			/>

			<p>{uiConfig.site.slogan}</p>

			<p>Swipe short videos, reveal full.</p>

			<p>Distinguish your content with your domain, brand and users.</p>

			<br />
			<br />

			<SwipeUpTutorialText absolute={false} />
		</div>
	);
}
