import React from 'react';
import { PostMediaDto } from 'src/types/DTOs';
import DelayedButton from 'src/components/DelayedButton';
import { secondsToPrettyDuration } from '@atas/weblib-ui-js';
import postActions from 'src/redux/actions/postActions';

interface Props {
	fullMedia?: PostMediaDto;
}

export default function ViewFullMediaButton({ fullMedia }: Props) {
	if (!fullMedia?.video?.duration) return null;

	const moveMediaHeader = () => {
		postActions.moveMediaToHead(fullMedia.postId, fullMedia.id);
	};

	return (
		<DelayedButton
			loggedInOnly
			data-infinitescroll="scroll"
			onDelayedClick={() => moveMediaHeader()}
			className="main gold viewFullMediaBtn">
			View full {secondsToPrettyDuration(fullMedia.video?.duration)} video
		</DelayedButton>
	);
}
