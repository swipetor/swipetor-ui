import React, { useEffect, useState } from 'react';
import { PostForUser } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';
import PostSummary from 'src/pages/user/PostSummary';
import TopLogo from 'src/appshell/TopLogo';

const FavPosts: React.FC = () => {
	const [posts, setPosts] = useState<PostForUser[]>([]);

	useEffect(() => {
		(async () => {
			const response = await httpClient.get<PostForUser[]>('/api/posts/favs');
			setPosts(response.data);
		})();
	}, []);

	return (
		<>
			<TopLogo />
			<div>
				<h1>Favourites</h1>

				<div className="singlePostsList">
					{posts.map(p => (
						<PostSummary key={p.id} post={p} />
					))}
				</div>
			</div>
		</>
	);
};

export default FavPosts;
