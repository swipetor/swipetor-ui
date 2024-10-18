import { intOrDefault } from '@atas/weblib-ui-js';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PostDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';

function PostRedirector() {
	const [post, setPost] = useState<PostDto | undefined>();
	const params = useParams<{ postId: string }>();
	const postId = intOrDefault(params.postId);

	useEffect(() => {
		const fetchPost = async () => {
			const response = await httpClient.get<PostDto>(`/api/posts/${postId}`);
			setPost(response.data);
		};

		fetchPost();
	}, [postId]);

	if (post) {
		return <Navigate to={`/c/${post.hubs[0].id}/p/${post.id}`} />;
	}

	return null;
}

export default PostRedirector;
