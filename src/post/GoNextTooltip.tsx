import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import DelayedButton from 'src/components/DelayedButton';
import { PostDto } from 'src/types/DTOs';

interface Props {
	post: PostDto;
	isActivePost: boolean;
	activeMediaId?: number;
}

interface State {
	isClosed: boolean;
}

const GoNextTooltip: React.FC<Props> = ({ post, isActivePost, activeMediaId }) => {
	const [isClosed, setIsClosed] = useState(false);

	const handleClose = () => {
		setIsClosed(true);
	};

	const handleDontShowAgain = () => {
		localStorage.setItem('hideGoNextTooltip', 'true');
		handleClose();
	};

	const shouldShow = () => {
		if (isClosed || localStorage.getItem('hideGoNextTooltip') === 'true') return false;
		if (!isActivePost) return false;
		return true;
	};

	const isLastPostItem = () => {
		const currentIndex = post.medias.findIndex(m => m.id === activeMediaId);
		return currentIndex >= post.medias.length - 1;
	};

	useEffect(() => {
		PubSub.publish('video.playpause');
	}, []);

	if (!shouldShow()) return null;

	return (
		<div className={'goNextTooltip'} onClick={() => PubSub.publish('video.playpause')}>
			<div className="contents">
				{!isLastPostItem() && (
					<p>
						➡️ <span className="bold">Right</span> for the next item in this post.
					</p>
				)}
				<p>
					⬇️ <span className="bold">Down</span> to next post.
				</p>
				<p className="actions">
					<DelayedButton
						onClick={e => e.stopPropagation()}
						onDelayedClick={e => handleDontShowAgain()}
						className="main grey">
						Don't show again
					</DelayedButton>
					<DelayedButton
						onClick={e => e.stopPropagation()}
						onDelayedClick={e => handleClose()}
						className="main white">
						Close
					</DelayedButton>
				</p>
			</div>
		</div>
	);
};

export default GoNextTooltip;
