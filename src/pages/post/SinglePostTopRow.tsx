import React from 'react';
import DelayedLink from 'src/components/DelayedLink';
import UploadedPhoto from 'src/components/UploadedPhoto';
import FollowButton from 'src/pages/post/FollowButton';
import UserMsgButton from 'src/pages/user/UserMsgButton';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import { PostForUser } from 'src/types/DTOs';

interface Props {
	post: PostWithIndex<PostForUser>;
}

export default function SinglePostTopRow({ post }: Props) {
	if (!post.user || !post.user.username) return null;

	return (
		<div className="topRow">
			{post?.user && (
				<div className="userInfoDiv">
					<DelayedLink
						to={`/u/${post.user.id}/${post.user.username.toLowerCase()}`}
						className="mainBtn transparent userInfo">
						<UploadedPhoto isUserPhoto size={64} photo={post.user.photo} />@{post.user.username}
					</DelayedLink>
					<FollowButton user={post.user} />
					&nbsp;&nbsp;
					<UserMsgButton user={post.user} className="follow" />
				</div>
			)}
		</div>
	);
}
