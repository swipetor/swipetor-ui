import { Logger, LogLevels } from '@atas/weblib-ui-js';
import React, { useEffect, useRef } from 'react';
import { useUIStore } from 'src/redux/reduxUtils';
import { usePostsPanelKeyboardShortcuts, useUrlParams } from 'src/post/PostsPanelHooks';
import PostsPanelLoading from 'src/post/PostsPanelLoading';
import NoPostsMsg from 'src/post/NoPostsMsg';
import KeyboardAndSwipeHints from 'src/post/KeyboardAndSwipeHints';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';
import postActions from 'src/redux/actions/postActions';
import { useLocation } from 'react-router-dom';
import { useEffectAsync } from 'src/utils/reactUtils';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import { StaticPostType } from 'src/post/genericPosts/StaticPost';
import SinglePost from 'src/post/SinglePost';

const logger = new Logger('PostsPanel', LogLevels.Warn);

interface Props {
	postId?: number;
}

const postsToRender = 5;

export default function PostsPanel(props: Props) {
	const postsCont = useRef<HTMLDivElement>(null);
	const location = useLocation();
	usePostsPanelKeyboardShortcuts(); // registers keyboard shortcuts
	const urlParams = useUrlParams(props.postId);

	// region From store
	const allPosts = useUIStore(s => s.post.posts);
	const pix = useUIStore(s => s.post.pix);
	const swiped = useUIStore(s => s.post.swiped);

	const contextPosts = useUIStore(s => {
		const starti = Math.max(s.post.pix - 1, 0);
		return s.post.posts?.slice(starti, starti + postsToRender);
	});
	logger.verbose('ContextPosts: ', contextPosts);
	// endregion

	useInfiniteScroll(postsCont);

	// region Component mounts
	useEffectAsync(async () => {
		postActions.clearPosts();

		if (location.pathname === '/') {
			postActions.addGenericPost({
				type: 'StaticPostType',
				component: 'WelcomePost',
			} as StaticPostType);
		}

		await postActions.fetchPosts(urlParams.postId, urlParams.userId, [urlParams.hubId!]);
	}, [urlParams.hubId, urlParams.userId]);
	// endregion

	// region Active post changes
	useEffect(() => {
		// Fetch more posts
		if (allPosts && allPosts.length - pix < 8) {
			logger.verbose('Fetching more posts');
			postActions.fetchPosts(undefined, urlParams.userId, urlParams.hubId ? [urlParams.hubId] : undefined);
		}

		pix >= 1 && postActions.swiped(true);
	}, [pix]);
	// endregion

	// Determine the index for each post
	const postIndices: (PostWithIndex | undefined)[] = new Array(postsToRender).fill(undefined);
	contextPosts?.forEach(post => {
		// Sticky indexed posts
		postIndices[post.index % postsToRender] = post;
	});

	useEffect(() => logger.info('PostIndices: ', postIndices), [...postIndices]);

	useEffect(() => {
		if (!swiped) {
			setTimeout(() => {
				postsCont.current?.classList.add('animateTutorial');
				setTimeout(() => {
					postsCont.current?.classList.remove('animateTutorial');
				}, 2100);
			}, 1000);
		}
	}, []);

	return (
		<div ref={postsCont} id="postsPanel" data-infinitescroll="any">
			{allPosts === null && <PostsPanelLoading />}

			{allPosts !== null && (
				<>
					<NoPostsMsg posts={allPosts} />

					{/*<PostsPanelTopRight hubId={urlParams.hubId} />*/}

					<KeyboardAndSwipeHints />

					{postIndices.map((post, index) => (
						<SinglePost key={index} post={post} />
					))}
				</>
			)}
		</div>
	);
}
