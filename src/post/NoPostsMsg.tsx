import React from 'react';
import DelayedLink from 'src/components/DelayedLink';
import TopLogo from 'src/appshell/TopLogo';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

export default function NoPostsMsg({ posts }: { posts?: PostWithIndex[] }) {
	if (posts && posts.length == 0) {
		return (
			<>
				<TopLogo />
				<div className={'noPostsInHub'}>
					<div>
						<p style={{ textAlign: 'center' }}>
							<span className="material-icons-outlined">info</span>&nbsp; No posts in this hub yet, be the
							first!
						</p>
						<p style={{ textAlign: 'center' }}>
							<DelayedLink to={`/post-builder`} loggedInOnly className="mainBtn block">
								<span className="material-icons">add</span> Post
							</DelayedLink>
						</p>
					</div>
				</div>
			</>
		);
	}

	return null;
}
