import { PostWithIndex } from 'src/redux/reducers/postReducer';
import { PostForUser } from 'src/types/DTOs';
import React from 'react';
import SinglePost from 'src/pages/post/SinglePost';
import { Logger, LogLevels } from '@atas/weblib-ui-js';

interface Props {
	post?: PostWithIndex;
}

const logger = new Logger('SingleGenericPost', LogLevels.Info);

export default function SingleGenericPost({ post }: Props) {
	logger.verbose('SingleGenericPost: ', post);
	if (!post) return null;

	if (post.type === 'PostForUser') {
		return <SinglePost post={post as PostWithIndex} />;
	}

	return null;
}
