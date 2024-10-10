import { Logger, LogLevels } from '@atas/weblib-ui-js';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DelayedLink from 'src/components/DelayedLink';
import EditPostTitlePopup from 'src/postBuilder/popups/EditPostTitlePopup';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';
import DelayedButton from '../components/DelayedButton';
import { PostDto } from '../types/DTOs';
import PostBuilderMediaFrame from './mediaItems/PostBuilderMediaFrame';
import AddPhotoPopup from './popups/AddPhotoPopup';
import AddVideoPopup from './popups/AddVideoPopup';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';
import { HubSelectDiv } from 'src/postBuilder/HubSelectDiv';
import { setPageTitle } from 'src/utils/windowUtils';

interface State {
	post?: PostDto;
	selectedHubIds: number[];
	posterUserId?: number;
}

const logger = new Logger(PostBuilder, LogLevels.Info);

export default function PostBuilder() {
	const navigate = useNavigate();
	const { s, refreshPost, submitUpdate } = usePostBuilderContext();

	setPageTitle('Post Builder');

	async function remove() {
		popupActions.popupMsg({
			title: 'Delete post?',
			content: 'Are you sure to delete this post?',
			okayBtnClick: async () => {
				await httpClient.delete(`/api/posts/${s.post?.id}`);
				navigate('/post-builder');
			},
		});
	}

	function editPostTitlePopup() {
		popupActions.showGlobalPopupComponent(() => (
			<EditPostTitlePopup title={s.post?.title} postId={s.post?.id} refresh={() => refreshPost()} />
		));
	}

	if (!s.post) return null;

	return (
		<>
			<div className="postBuilderDiv box centeredPage">
				<h2>
					<DelayedLink to={`/p/${s.post.id}`} className="mainBtn right">
						View
					</DelayedLink>
					Post: "{s.post.title}"{' '}
					<DelayedButton onDelayedClick={() => editPostTitlePopup()}>
						<span className="material-icons">edit</span>
					</DelayedButton>
				</h2>

				<div style={{ float: 'right' }}>
					{s.post?.isPublished && (
						<span>
							<span className="material-icons" style={{ color: 'green' }}>
								fiber_manual_record
							</span>{' '}
							Published
						</span>
					)}
					{!s.post?.isPublished && (
						<span>
							<span className="material-icons" style={{ color: 'grey' }}>
								fiber_manual_record
							</span>{' '}
							Draft
						</span>
					)}
				</div>

				<p>
					<span className="material-icons">add</span>
					Build your post by adding media.
				</p>

				<div className="mediaItemAddButtons">
					<DelayedButton
						onDelayedClick={() =>
							popupActions.showGlobalPopupComponent(() => (
								<AddVideoPopup postId={s.post!.id} refresh={async () => refreshPost()} />
							))
						}
						className="main grey">
						<span className="material-icons">video_call</span>
						Add Video
					</DelayedButton>

					<DelayedButton
						onDelayedClick={() =>
							popupActions.showGlobalPopupComponent(() => (
								<AddPhotoPopup postId={s.post!.id} refresh={() => refreshPost()} />
							))
						}
						className="main grey">
						<span className="material-icons">add_photo_alternate</span>
						Add Photo
					</DelayedButton>
				</div>

				{s.post.medias.map((mi, i) => (
					<PostBuilderMediaFrame key={mi.id} media={mi} counter={i} />
				))}

				<HubSelectDiv />

				<p className="block" style={{ display: 'flex' }}>
					<button
						disabled={s.isUpdating}
						onClick={async () => submitUpdate(false)}
						className={`main block ${!s.isUpdating ? 'grey' : ''}`}>
						{s.isUpdating && <span className="material-icons-outlined">hourglass_top</span>}
						{!s.isUpdating && <span className="material-icons-outlined">save</span>}
						Save Draft
					</button>
					<button disabled={s.isUpdating} onClick={() => submitUpdate(true)} className="main block">
						{s.isUpdating && <span className="material-icons-outlined">hourglass_top</span>}
						Publish
						{!s.isUpdating && <span className="material-icons-outlined">navigate_next</span>}
					</button>
				</p>

				<p className="block" style={{ display: 'flex' }}>
					<button onClick={async () => remove()} className="main dark block">
						<span className="material-icons-outlined">delete</span>&nbsp; Delete
					</button>
				</p>
			</div>
		</>
	);
}
