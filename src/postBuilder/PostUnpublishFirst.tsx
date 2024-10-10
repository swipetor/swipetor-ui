import React from 'react';
import DelayedButton from 'src/components/DelayedButton';
import { PostDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';

interface Props {
	post: PostDto;
	refreshFn(): void;
}

async function unpublishPost(postId: number, refreshFn: () => void) {
	await httpClient.delete(`/api/posts/${postId}/publish`, {});
	refreshFn();
}

export default function PostUnpublishFirst(props: Props) {
	return (
		<div className="box centeredPage">
			<p>Post is published. Cannot edit a published post.</p>

			<DelayedButton
				onDelayedClick={async () => unpublishPost(props.post.id, props.refreshFn)}
				className="main block">
				Unpublish first to edit?
			</DelayedButton>
		</div>
	);
}
