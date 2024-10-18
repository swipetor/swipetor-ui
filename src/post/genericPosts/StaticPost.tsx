import React, { useEffect } from 'react';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import WelcomePost from 'src/post/genericPosts/WelcomePost';
import WhySwipetorPost from 'src/post/genericPosts/WhySwipetorPost';
import { useUIStore } from 'src/redux/reduxUtils';
import playerProvider from 'src/libs/player/playerProvider';
import { setDefaultPageTitle } from 'src/utils/windowUtils';
import { useNavigate } from 'react-router-dom';

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

export default function StaticPost(props: Props) {
	const pix = useUIStore(s => s.post.pix);
	const navigate = useNavigate();

	useEffect(() => {
		if (pix === props.post?.index) {
			playerProvider.pauseAll();
			setDefaultPageTitle();
			navigate('/', { replace: true });
		}
	}, [pix]);

	if (!props.post?.component) return null;
	const Component = StaticPostMap[props.post.component];
	return <div className="staticPost">{props.post && <Component />}</div>;
}
