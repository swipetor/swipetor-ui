import React, { useEffect } from 'react';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import WelcomePost from 'src/post/genericPosts/WelcomePost';
import WhySwipetorPost from 'src/post/genericPosts/WhySwipetorPost';
import { useUIStore } from 'src/redux/reduxUtils';
import playerProvider from 'src/libs/player/playerProvider';
import { setDefaultPageTitle } from 'src/utils/windowUtils';
import { useNavigate } from 'react-router-dom';
import { useUrlParams } from 'src/post/PostsPanelHooks';
import { getUrlWithQuery } from '@atas/weblib-ui-js';

export class StaticPostType {
	type = 'StaticPostType';
	component: keyof typeof StaticPostMap | null = null;
}

export const StaticPostMap = {
	WelcomePost: WelcomePost,
	WhySwipetorPost: WhySwipetorPost,
};

interface Props {
	post?: PostWithIndex<StaticPostType>;
}

export default function StaticPost({ post }: Props) {
	const pix = useUIStore(s => s.post.pix);
	const navigate = useNavigate();
	const divRef = React.useRef<HTMLDivElement>(null);
	const urlParams = useUrlParams();

	if (!post) return null;

	useEffect(() => {
		const player = playerProvider.getPlayerForIndex(post.index);
		if (player && divRef.current) {
			player.moveInto(divRef.current);
		}
	}, [post]);

	useEffect(() => {
		if (pix === post?.index) {
			playerProvider.pauseAll();
			setDefaultPageTitle();

			const url = getUrlWithQuery('/', { hubId: urlParams.hubId });
			navigate(url, { replace: true });
		}
	}, [pix]);

	if (!post?.component) return null;
	const Component = StaticPostMap[post.component];
	return (
		<div ref={divRef} className="staticPost">
			{post && <Component />}
		</div>
	);
}
