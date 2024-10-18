import SwipeUpTutorialText from 'src/post/SwipeUpTutorialText';
import React from 'react';

export default function WhySwipetorPost() {
	return (
		<div className="welcomePostDiv">
			<h1>Why use Swipetor?</h1>

			<ul>
				<li>Don't get lost in the crowded big social</li>
				<li>Take advantage of the distributed internet</li>
				<li>Your own brand and users</li>
				<li>Future-proof your business</li>
				<li>Distinguish your content from mediocre & AI-generated</li>
				<li>Have push notifications, messaging, comments</li>
				<li>Easily import videos from almost any source</li>
				<li>Monetise full videos, TBD</li>
				<li>All free & open-source.</li>
			</ul>

			<br />
			<br />

			<SwipeUpTutorialText absolute={false} />
		</div>
	);
}
