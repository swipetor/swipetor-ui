import { Logger, LogLevels } from '@atas/weblib-ui-js';
import React, { useEffect, useMemo } from 'react';
import { UIState } from 'src/redux/reducers/reducers';
import SingleMedia from '../media/SingleMedia';
import MediaProgressIndicators from '../media/MediaProgressIndicators';
import PostMenuRow from './PostMenuRow';
import SinglePostTopRow from './SinglePostTopRow';
import { useUIStore } from 'src/redux/reduxUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPostUrl } from 'src/utils/postUtils';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import { PostForUser } from 'src/types/DTOs';

interface Props {
	post?: PostWithIndex<PostForUser>;
}

export default function SinglePost({ post }: Props) {
	const activePix = useUIStore((s: UIState) => s.post.pix);
	const navigate = useNavigate();
	const singlePostRef = React.useRef<HTMLDivElement>(null);
	const location = useLocation();
	const touchingArea = useUIStore((s: UIState) => s.post.touchingArea);

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

		const postsUrl = getPostUrl(post);
		if (location.pathname !== postsUrl) {
			navigate(postsUrl, { replace: true });
		}
	}, [post, activePix]);

	const logger = useMemo(
		() =>
			new Logger('SinglePost', LogLevels.Info, '', () => ({
				activePostIndex: activePix,
				isActivePost: isActivePost(),
			})),
		[activePix],
	);

	/**
	 * @param next 1 for next active post, -1 for previous
	 */
	const isActivePost = (next = 0): boolean => post?.index === activePix + next;

	const singlePostCls = (): string => {
		const cls = ['singlePost'];
		if (isActivePost()) {
			cls.push('active');
			touchingArea && cls.push('touchingArea-' + touchingArea);
		} else if (isActivePost(1)) cls.push('next');
		else if (isActivePost(-1)) cls.push('prev');
		post && post.medias.length > 1 && cls.push('multiMedia');
		return cls.join(' ');
	};

	if (!post) return null;

	if (window.userDeviceInfo?.isBot && !isActivePost()) return null;

	return (
		<div ref={singlePostRef} data-post-index={post.index} className={singlePostCls()}>
			<MediaProgressIndicators post={post} />

			<SinglePostTopRow post={post} />

			{/*<PostsPanelTopRight />*/}

			{post.medias.map((_, i) => (
				<SingleMedia key={i} post={post} mix={i} />
			))}

			<PostMenuRow post={post} />
		</div>
	);
}
