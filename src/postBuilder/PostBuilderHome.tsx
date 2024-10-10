import React, { useEffect, useState } from 'react';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';
import { setPageTitle } from 'src/utils/windowUtils';
import DelayedButton from '../components/DelayedButton';
import DelayedLink from '../components/DelayedLink';
import { PostDto } from '../types/DTOs';
import CreateDraftPostPopup from './popups/CreateDraftPostPopup';
import TopLogo from 'src/appshell/TopLogo';

export default function PostBuilderHome() {
	const [draftPosts, setDraftPosts] = useState<PostDto[]>([]);
	const [publishedPosts, setPublishedPosts] = useState<PostDto[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const resp = await httpClient.get<PostDto[]>('/api/posts/all');

				setDraftPosts(resp.data.filter(post => !post.isPublished));
				setPublishedPosts(resp.data.filter(post => post.isPublished));
				setPageTitle('Post Builder Welcome page');
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	const renderPost = (post: PostDto, status: string) => (
		<DelayedLink key={post.id} to={`/post-builder/${post.id}`} className="mainBtn grey block">
			<span className="material-icons-outlined">description</span>
			&nbsp; {status} - {post.title}
		</DelayedLink>
	);

	return (
		<>
			<TopLogo />
			<h1>
				<span className="material-icons">control_point</span>
				Post Builder
			</h1>
			<div className="postBuilderHomeDiv box centeredPage">
				<DelayedLink className="mainBtn block" to="/camera">
					<span className="material-icons">camera</span>
					&nbsp; Snap Instant Post
				</DelayedLink>

				<br />

				<DelayedButton
					className="main block"
					onDelayedClick={() => popupActions.showGlobalPopupComponent(() => <CreateDraftPostPopup />)}>
					<span className="material-icons">add</span>
					&nbsp; Create Manual Post
				</DelayedButton>

				<hr />

				<p>Unpublished draft posts:</p>

				<div className="draftPostsList">{draftPosts.map(post => renderPost(post, 'Draft'))}</div>

				<p>Published posts:</p>
				<div className="draftPostsList">{publishedPosts.map(post => renderPost(post, 'Published'))}</div>
			</div>
		</>
	);
}
