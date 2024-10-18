import { Logger, LogLevels } from '@atas/weblib-ui-js';
import React, { useEffect, useMemo } from 'react';
import { UIState } from 'src/redux/reducers/reducers';
import SingleMedia from '../pages/media/SingleMedia';
import MediaProgressIndicators from '../pages/media/MediaProgressIndicators';
import PostMenuRow from './PostMenuRow';
import SinglePostTopRow from './SinglePostTopRow';
import { useUIStore } from 'src/redux/reduxUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPostUrl } from 'src/utils/postUtils';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import StaticPost, { StaticPostType } from 'src/post/genericPosts/StaticPost';
import { PostForUser } from 'src/types/DTOs';
import SwipeUpTutorialText from 'src/post/SwipeUpTutorialText';

interface Props {
	post?: PostWithIndex;
}

export default function SinglePost({ post }: Props) {
	const activePix = useUIStore((s: UIState) => s.post.pix);
	const navigate = useNavigate();
	const singlePostRef = React.useRef<HTMLDivElement>(null);
	const location = useLocation();
	const swiped = useUIStore((s: UIState) => s.post.swiped);

	const logger = useMemo(
		() =>
			new Logger('SinglePost', LogLevels.Info, '', () => ({
				activePostIndex: activePix,
				isActivePost: isActivePost(),
			})),
		[activePix],
	);

	// Reset transform when is inactive
	useEffect(() => {
		if (!singlePostRef.current || !post) return;

		if (!isActivePost()) {
			singlePostRef.current.style.transform = '';
			singlePostRef.current.style.transition = '';
		}
	}, [activePix]);

	useEffect(() => {
		if (!post || !isActivePost()) return;

		if (post.type === 'PostForUser') {
			const postsUrl = getPostUrl(post as PostWithIndex<PostForUser>);
			if (location.pathname !== postsUrl) {
				navigate(postsUrl, { replace: true });
			}
		}
	}, [post, activePix]);

	useEffect(() => {
		// Reset .next post's transform when page loads first time
		if (post && post.index === 1 && activePix === 0) {
			singlePostRef.current?.style.setProperty('transform', 'translate3d(0px, 100%, 0px)');
		}
	}, [post]);

	/**
	 * @param next 1 for next active post, -1 for previous
	 */
	const isActivePost = (next = 0): boolean => post?.index === activePix + next;

	const singlePostCls = (): string => {
		const cls = ['singlePost'];
		if (isActivePost()) {
			cls.push('active');
		} else if (isActivePost(1)) cls.push('next');
		else if (isActivePost(-1)) cls.push('prev');
		return cls.join(' ');
	};

	if (!post) return null;

	if (window.userDeviceInfo?.isBot && !isActivePost()) return null;

	const getPostForUser = () => {
		const p = post as PostWithIndex<PostForUser>;

		return (
			<>
				<MediaProgressIndicators post={p} />
				<SinglePostTopRow post={p} />
				{/*<PostsPanelTopRight />*/}

				{p.medias.map((_, i) => (
					<SingleMedia key={i} post={p} mix={i} />
				))}

				<PostMenuRow post={p} />

				{!swiped && <SwipeUpTutorialText absolute={true} />}
			</>
		);
	};

	const getStaticPost = () => {
		const p = post as PostWithIndex<StaticPostType>;
		return <StaticPost post={p} />;
	};

	return (
		<div ref={singlePostRef} data-post-index={post.index} className={singlePostCls()}>
			{post.type === 'PostForUser' && getPostForUser()}
			{post.type === 'StaticPostType' && getStaticPost()}
		</div>
	);
}
