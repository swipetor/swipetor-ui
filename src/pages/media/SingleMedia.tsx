import React, { useEffect } from 'react';
import ExclusiveLayer from 'src/pages/media/ExclusiveLayer';
import MediaDescription from 'src/post/MediaDescription';
import { useUIStore } from 'src/redux/reduxUtils';
import { PostMediaType } from 'src/types/enums';
import { isMediaExclusive } from 'src/utils/postUtils';
import PostVideo from './PostVideo';
import photoUtils from 'src/utils/photoUtils';
import playerProvider from 'src/libs/player/playerProvider';
import { PostForUser } from 'src/types/DTOs';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

interface Props {
	post: PostWithIndex<PostForUser>;
	mix: number;
}

export default function SingleMedia(props: Props) {
	const activePix = useUIStore(s => s.post.pix);
	const activeMix = useUIStore(s => s.post.mix);

	const isActive = () => {
		if (activePix !== props.post.index && props.mix === 0) return true; // first post is always active
		return activePix === props.post.index && activeMix === props.mix;
	};

	const m = props.post.medias[props.mix];

	const [width, height] = m.clippedVideo
		? [m.clippedVideo?.width, m.clippedVideo?.height]
		: [m.video?.width, m.video?.height];

	const aspectRatio = (width || 16) / (height || 9);
	const stretch = aspectRatio > 0.4 && aspectRatio < 0.7;

	const isExclusive = isMediaExclusive(props.post, m);

	const cls = ['singleMedia'];
	cls.push(m.type === PostMediaType.Photo ? 'img' : 'video');
	isActive() && cls.push('active');
	stretch && cls.push('stretch');

	useEffect(() => {
		if (isActive() && isExclusive) {
			playerProvider.pauseAll();
		}
	}, [activePix, activeMix]);

	return (
		<div
			key={m.id}
			data-media-index={props.mix}
			className={cls.join(' ')}
			style={{
				backgroundImage: `url(${photoUtils.getSrcByPhoto(m.previewPhoto)})`,
			}}>
			{!isExclusive && <PostVideo currentPost={props.post} currentMedia={m} />}

			{!isExclusive && <MediaDescription post={props.post} media={m} />}
			<ExclusiveLayer post={props.post} media={m} />
		</div>
	);
}
