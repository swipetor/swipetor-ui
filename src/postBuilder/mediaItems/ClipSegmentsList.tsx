import React from 'react';
import ClipSegment from './ClipSegment';
import DelayedButton from 'src/components/DelayedButton';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';

interface Props {
	mediaId: number;
}

export default function ClipSegmentsList({ mediaId }: Props) {
	const { s, updateMedia } = usePostBuilderContext();

	const media = s.post?.medias.find(m => m.id === mediaId);

	if (!media) return null;

	const handleAddClip = () => {
		const newClipTimes = [...(media.clipTimes || []), []];
		updateMedia(mediaId, { clipTimes: newClipTimes });
	};

	return (
		<div className="mediaClipSegmentsDiv">
			{media.clipTimes?.map((clip, index) => {
				return <ClipSegment key={index} index={index} mediaId={mediaId} clip={clip} />;
			})}
			<div className="actionBar">
				<span className="helperText">
					Clip times format: <strong>minute:second</strong> e.g. 1:10 or 70
				</span>
				<DelayedButton onDelayedClick={handleAddClip} className="main grey">
					Add new clip
				</DelayedButton>
			</div>
		</div>
	);
}
