import { Logger, LogLevels } from '@atas/weblib-ui-js';
import React, { useEffect, useRef, useState } from 'react';
import { useUIStore } from 'src/redux/reduxUtils';
import { usePostsPanelKeyboardShortcuts, useUrlParams } from 'src/pages/post/PostsPanelHooks';
import PostsPanelLoading from 'src/pages/post/PostsPanelLoading';
import NoPostsMsg from 'src/pages/post/NoPostsMsg';
import KeyboardAndSwipeHints from 'src/pages/post/KeyboardAndSwipeHints';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';
import postActions from 'src/redux/actions/postActions';
import BotsLanding from 'src/pages/home/BotsLanding';
import { useLocation } from 'react-router-dom';
import userDeviceInfo from 'src/utils/userDeviceInfo';
import { useEffectAsync } from 'src/utils/reactUtils';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import SingleGenericPost from 'src/pages/post/genericPosts/SingleGenericPost';
import SwipeUpTutorialText from 'src/pages/post/SwipeUpTutorialText';

const logger = new Logger('PostsPanel', LogLevels.Info);

interface Props {
	postId?: number;
}

const postsToRender = 5;

export default function PostsPanel(props: Props) {
	const postsCont = useRef<HTMLDivElement>(null);
	const location = useLocation();
	usePostsPanelKeyboardShortcuts(); // registers keyboard shortcuts
	const urlParams = useUrlParams(props.postId);
	const { postId } = urlParams;

	// region From store
	const allPosts = useUIStore(s => s.post.posts);
	const pix = useUIStore(s => s.post.pix);

	const [swiped, setSwiped] = useState(localStorage.getItem('swiped'));

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

		if (pix >= 1) {
			localStorage.setItem('swiped', '1');
			setSwiped('1');
		}
	}, [pix]);
	// endregion

	if (userDeviceInfo.isBot && location.pathname === '/') {
		return <BotsLanding />;
	}

	// Determine the index for each post
	const postIndices: (PostWithIndex | undefined)[] = new Array(postsToRender).fill(undefined);
	contextPosts?.forEach(post => {
		// Sticky indexed posts
		postIndices[post.index % postsToRender] = post;
	});

	useEffect(() => logger.info('PostIndices: ', postIndices), [...postIndices]);

	useEffect(() => {
		if (swiped !== '1') {
			setTimeout(() => {
				postsCont.current?.classList.add('animateTutorial');
				setTimeout(() => {
					postsCont.current?.classList.remove('animateTutorial');
				}, 2100);
			}, 1000);
		}
	}, []);

	return (
		<div ref={postsCont} id="postsPanel">
			{allPosts === null && <PostsPanelLoading />}

			{allPosts !== null && (
				<>
					<NoPostsMsg posts={allPosts} />

					{/*<PostsPanelTopRight hubId={urlParams.hubId} />*/}

					<KeyboardAndSwipeHints />

					{postIndices.map((post, index) => (
						<SingleGenericPost key={index} post={post} />
					))}

					{swiped !== '1' && <SwipeUpTutorialText />}
				</>
			)}
		</div>
	);
}
