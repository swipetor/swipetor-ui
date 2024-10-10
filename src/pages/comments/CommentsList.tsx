import React, { useEffect, useState } from 'react';
import WriteComment from 'src/pages/comments/WriteComment';
import httpClient from 'src/utils/httpClient';
import { CommentDto, PostDto } from 'src/types/DTOs';
import SingleComment from './SingleComment';

interface Props {
	post: PostDto;
	close(): void;
}

export default function CommentsList(props: Props) {
	const [comments, setComments] = useState<CommentDto[] | undefined>([]);

	useEffect(() => {
		(async () => {
			const response = await httpClient.get<CommentDto[]>(`/api/posts/${props.post.id}/comments`);
			setComments(response.data);
		})();
	}, [props.post.id]);

	return (
		<div className="commentsList">
			{(comments || []).map(c => (
				<SingleComment key={c.id} comment={c} />
			))}
			{comments?.length === 0 && (
				<div>
					Be the first commenter, seen at top!
					<br />
					<br />
				</div>
			)}
			<WriteComment close={props.close} postId={props.post.id} />
		</div>
	);
}
