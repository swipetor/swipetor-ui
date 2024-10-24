import { PostDto, PostForUser, PostMediaDto } from 'src/types/DTOs';
import React, { useRef } from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import DelayedLink from 'src/components/DelayedLink';
import { getPostUrl } from 'src/utils/postUtils';
import { secondsToPrettyDuration } from '@atas/weblib-ui-js';
import ProgressIndicators from 'src/components/ProgressIndicators';
import { useHorizontalScroll } from 'src/hooks/useHorizontalScroll';

interface Props {
	post: PostForUser;
}

export default function PostSummary(props: Props) {
	const mediasDivRef = useRef<HTMLDivElement>(null);
	const activeIndex = useHorizontalScroll(mediasDivRef);
	const p = props.post;

	return (
		<DelayedLink to={getPostUrl(p, { userId: p.userId })} className="postSummaryWrapperLnk btn">
			<ProgressIndicators total={p.medias.length} active={activeIndex} />
			<div className="mediasDiv" ref={mediasDivRef}>
				{p.medias.map((m, i) => getMedia(i, m, p))}
			</div>
		</DelayedLink>
	);
}

function getMedia(i: number, m: PostMediaDto, p: PostDto) {
	return (
		<div key={m.id} className="media">
			<div className={`mediaPhotoDiv`}>
				<UploadedPhoto photo={m.previewPhoto} className="mediaPhoto" />
				<div className="mediaTime">
					{m.video?.duration && <span>{secondsToPrettyDuration(m.video.duration)}</span>}
				</div>
			</div>
			<p className="title">{m.description || p.title}</p>
		</div>
	);
}
