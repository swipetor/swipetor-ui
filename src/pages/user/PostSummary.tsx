import { PostDto, PostForUser, PostMediaDto } from 'src/types/DTOs';
import React, { useRef } from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import DelayedLink from 'src/components/DelayedLink';
import { getPostUrl } from 'src/utils/postUtils';
import { secondsToPrettyDuration } from '@atas/webapp-ui-shared';
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
			<div className={`mediaPhotoDiv ${m.isFollowersOnly ? 'exclusiveMedia' : ''}`}>
				<UploadedPhoto photo={m.previewPhoto} className="mediaPhoto" />
				<div className="exclusiveText">
					<span className="material-icons">star</span>
					<p>Exclusive</p>
				</div>
				<div className="mediaTime">
					{m.video?.duration && <span>{secondsToPrettyDuration(m.video.duration)}</span>}
				</div>
				<div className="currentMedia">
					<span className="material-icons">swipe</span>&nbsp;&nbsp;
					{i + 1} / {p.medias.length}
				</div>
			</div>
			<p className="title">{m.description || p.title}</p>
		</div>
	);
}
