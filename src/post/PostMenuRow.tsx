import { Logger, LogLevels, prettyNumberCount } from '@atas/weblib-ui-js';
import React from 'react';
import { useSelector } from 'react-redux';
import DelayedButton from 'src/components/DelayedButton';
import CommentsList from 'src/pages/comments/CommentsList';
import popupActions from 'src/redux/actions/popupActions';
import { UIState } from 'src/redux/reducers/reducers';
import { PostDto, PostForUser } from 'src/types/DTOs';
import { sharePostOrCopyLink } from 'src/utils/postUtils';
import SinglePostMenu from './moderate/SinglePostMenu';
import postActions from 'src/redux/actions/postActions';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

interface Props {
	post: PostWithIndex<PostForUser>;
}

const logger = new Logger('PostMenuRow', LogLevels.Info);

const PostMenuRow: React.FC<Props> = ({ post }) => {
	const currentUser = useSelector((state: UIState) => state.my.user);
	const isMuted = useSelector((state: UIState) => state.post.isMuted);

	const openPostMenu = (post: PostDto) => {
		popupActions.slidingPopup({
			title: 'Post menu',
			isOpen: true,
			children: () => <SinglePostMenu post={post} closeFn={() => popupActions.slidingPopup({ isOpen: false })} />,
		});
	};

	const openCommentsMenu = (post: PostDto) => {
		popupActions.slidingPopup({
			title: 'Comments',
			isOpen: true,
			children: () => (
				<CommentsList key="CL" post={post} close={() => popupActions.slidingPopup({ isOpen: false })} />
			),
		});
	};

	const sharePost = () => {
		sharePostOrCopyLink(post, currentUser?.id);
	};

	return (
		<div className="postMenuRow" data-infinitescroll="scroll">
			<DelayedButton
				onDelayedClick={() => postActions.mute(!isMuted)}
				title="Mute / Unmute"
				className={'muteBtn ' + (isMuted ? 'muted' : '')}>
				<span className="material-icons">{isMuted ? 'volume_off' : 'volume_up'}</span>
			</DelayedButton>

			<DelayedButton
				title="Favourite"
				loggedInOnly
				onDelayedClick={async () => postActions.fav(post.id, !post.userFav)}>
				<span className="material-icons">{post.userFav ? 'star' : 'star_outline'}</span>
				<span className="text">{post.favCount > 0 ? post.favCount : ''}</span>
			</DelayedButton>

			<DelayedButton title="Comments" onDelayedClick={() => openCommentsMenu(post)}>
				<span className="icon material-icons-outlined">comment</span>
				<span className="text">{prettyNumberCount(post.commentsCount)}</span>
			</DelayedButton>

			<DelayedButton onDelayedClick={sharePost} title="Share post">
				<span className="material-icons">share</span>
			</DelayedButton>

			{/*<DelayedButton
			  title="Send a message to the poster user"
			  loggedInOnly
			  onDelayedClick={() =>
			    currentUser &&
			    popupActions.showGlobalPopupComponent(
			      <InitPmThreadPopup userToMsg={post.user!} postId={post.id} />,
			    )
			  }>
			  <span className="icon material-icons-outlined">alternate_email</span>
			</DelayedButton>*/}

			{/*<DelayedButton
			  title="Video sprite"
			  className={isSpriteBtnDisabled ? 'disabled' : ''}
			  onDelayedClick={() =>
			    !isSpriteBtnDisabled &&
			    popupActions.slidingPopup({
			      title: 'Video Sprite',
			      isOpen: true,
			      child: <HorizontalVideoSprite media={activeMedia} />,
			    })
			  }>
			  <span className="material-icons">theaters</span>
			</DelayedButton>*/}

			<DelayedButton onDelayedClick={() => openPostMenu(post)}>
				<span className="icon material-icons-outlined">more_horiz</span>
			</DelayedButton>
		</div>
	);
};

export default PostMenuRow;
