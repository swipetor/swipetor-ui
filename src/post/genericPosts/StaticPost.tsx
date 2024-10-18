import React from 'react';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import WelcomePost from 'src/post/genericPosts/WelcomePost';

export class StaticPostType {
	type = 'StaticPostType';
	component: keyof typeof StaticPostMap | null = null;
}

export const StaticPostMap = {
	WelcomePost: WelcomePost,
};

interface Props {
	post?: PostWithIndex<StaticPostType>;
}

export default function StaticPost(props: Props) {
	if (!props.post?.component) return null;
	const Component = StaticPostMap[props.post.component];
	return <div className="staticPost">{props.post && <Component />}</div>;
}