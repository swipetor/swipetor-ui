import React from 'react';
import DelayedLink from 'src/components/DelayedLink';

const Landing: React.FC = () => {
	return (
		<div className="landing">
			<h1>Short & Exclusive videos to your subscriber fans</h1>
			<p>
				Monetize exclusive videos on your own short videos app like TikTok, Instagram Reels and YouTube Shorts.
				Engage in real-time with push notifications, and maintain full control over your community and data
				without the limitations of the big social. Have your own custom web domain. Run on cloud or on your own
				servers.
			</p>
			<p>
				<DelayedLink to="/p/" className={'mainBtn block'}>
					Enter Site
				</DelayedLink>
			</p>
		</div>
	);
};

export default Landing;
