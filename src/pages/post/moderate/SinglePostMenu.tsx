import React from 'react';
import DelayedButton from 'src/components/DelayedButton';
import DelayedLink from 'src/components/DelayedLink';
import popupActions from 'src/redux/actions/popupActions';
import { PostDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';
import { canEditPost, canRemovePost } from 'src/utils/permUtils';
import uiConfig from 'src/init/uiConfig';
import { Logger, LogLevels } from '@atas/weblib-ui-js';
import { copyPostLink } from 'src/utils/postUtils';
import { useSelector } from 'react-redux';
import { UIState } from 'src/redux/reducers/reducers';

interface Props {
	post: PostDto;
	closeFn: (isInstant?: boolean) => void;
}

const SinglePostMenu: React.FC<Props> = ({ post, closeFn }) => {
	const user = useSelector((state: UIState) => state.my.user);

	const logger = new Logger(SinglePostMenu, LogLevels.Info);

	const closeAndRun = (fn: () => void) => {
		fn();
		popupActions.slidingPopup({ isOpen: false });
	};

	const removeTopic = () => {
		closeFn(true);
		popupActions.popupMsg({
			title: 'Remove post?',
			content: () => (
				<div>
					Post below will be removed.
					{/* <br /> <i>{shortenString(this.props.post.txt, 60)}</i> */}
				</div>
			),
			okayBtn: 'Remove',
			okayBtnClick: async () => removePostExecute(true),
		});
	};

	const removePostExecute = async (isRemoved: boolean) => {
		await httpClient.delete(`/api/posts/${post.id}`, {
			data: { isRemoved },
		});
	};

	const bringBackPost = () => {
		popupActions.popupMsg({
			title: 'Bring post back?',
			content: () => (
				<div>
					Topic below won't be removed anymore and will be displayed on the hub.
					{/* <br /> <i>{shortenString(this.props.post.txt, 20)}</i> */}
				</div>
			),
			okayBtn: 'Bring back',
			okayBtnClick: async () => removePostExecute(false),
		});
	};

	async function requestFullscreen() {
		const cont = document.querySelector('#postsPanel .singlePost.active .singleMedia.active video');
		if (!cont) return logger.error('setFullScreen(): No video element found');

		try {
			if (cont.requestFullscreen) {
				await cont.requestFullscreen();
			} else if ((cont as any).webkitEnterFullScreen) {
				await (cont as any).webkitEnterFullScreen();
			} else {
				return logger.error('setFullScreen(): requestFullscreen is not supported on', cont);
			}
		} catch (error) {
			logger.error('setFullScreen(): requestFullscreen error', error);
		}
	}

	return (
		<div className="popupMenu singlePostMenu">
			{canEditPost(post) && (
				<DelayedLink to={`/post-builder/${post.id}`}>
					<span className="material-icons">edit</span> Edit
				</DelayedLink>
			)}

			<DelayedButton
				onDelayedClick={() => {
					closeFn();
					popupActions.popupMsg({
						content: `Please email the link of video to ${uiConfig.site.email} and explain the issue.`,
						cancelBtn: null,
					});
				}}>
				<span className="material-icons">report</span> Report
			</DelayedButton>

			<DelayedButton onDelayedClick={() => closeAndRun(() => copyPostLink(post, user?.id))}>
				<span className="material-icons">link</span>
				Copy link
			</DelayedButton>

			<DelayedButton onDelayedClick={() => closeAndRun(requestFullscreen)}>
				<span className="material-icons">fullscreen</span> Fullscreen
			</DelayedButton>

			{canRemovePost(post.id) && !post.isRemoved && (
				<DelayedButton onDelayedClick={() => removeTopic()}>
					<span className="material-icons">delete</span> Remove
				</DelayedButton>
			)}
			{canRemovePost(post.id) && post.isRemoved && (
				<DelayedButton onDelayedClick={() => bringBackPost()}>
					<span className="material-icons">delete_outline</span> Un-remove
				</DelayedButton>
			)}
		</div>
	);
};

export default SinglePostMenu;
