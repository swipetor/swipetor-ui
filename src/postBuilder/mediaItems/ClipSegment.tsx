import React, { useEffect } from 'react';
import DelayedButton from 'src/components/DelayedButton';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';
import { humanDurationToSeconds, Logger, LogLevels, secondsToHumanDuration } from '@atas/weblib-ui-js';

interface Props {
	index: number;
	clip: number[];
	mediaId: number;
}

export default function ClipSegment(props: Props) {
	const logger = new Logger(ClipSegment, LogLevels.Warn, undefined, () => props);

	const [from, setFrom] = React.useState<string>(secondsToHumanDuration(props.clip[0]));
	const [to, setTo] = React.useState<string>(secondsToHumanDuration(props.clip[1]));

	const { s, updateMedia, updateS } = usePostBuilderContext();
	const media = s.post?.medias.find(m => m.id === props.mediaId);

	logger.info(`clipTimes, `, media?.clipTimes, { from, to });

	useEffect(() => {
		setFrom(secondsToHumanDuration(props.clip[0]));
		setTo(secondsToHumanDuration(props.clip[1]));
	}, [props.clip, props.clip[0], props.clip[1]]);

	const isEditing = s.editingClipIndex?.[0] === props.mediaId && s.editingClipIndex?.[1] === props.index;

	useEffect(() => {
		const time = s.currentTime[props.mediaId];
		if (time >= props.clip[0] && time <= props.clip[1] && !isEditing) {
			setEditingClipIndex();
		}
	}, [s.currentTime[props.mediaId]]);

	if (!media) return null;

	const handleClipChange = () => {
		const newClipTimes = [...(media.clipTimes || [])];

		const f = humanDurationToSeconds(from);
		const t = humanDurationToSeconds(to);
		if (Number.isFinite(f) && Number.isFinite(t)) {
			newClipTimes[props.index] = [f!, t!, newClipTimes[props.index][2]];
			updateMedia(props.mediaId, { clipTimes: newClipTimes });
		}
	};

	const handleDeleteClip = () => {
		const newClipTimes = media.clipTimes?.filter((_, i) => i !== props.index);
		updateMedia(props.mediaId, { clipTimes: newClipTimes });
	};

	const handleMove = (direction: 'up' | 'down') => {
		if (!media.clipTimes) return;

		const newClipTimes = [...media.clipTimes];
		const indexAdjustment = direction === 'up' ? -1 : 1;
		const newIndex = props.index + indexAdjustment;

		if (newIndex < 0 || newIndex >= newClipTimes.length) return;

		[newClipTimes[props.index], newClipTimes[newIndex]] = [newClipTimes[newIndex], newClipTimes[props.index]];

		updateMedia(props.mediaId, { clipTimes: newClipTimes });
	};

	const setEditingClipIndex = () => {
		if (!isEditing) {
			updateS({ editingClipIndex: [props.mediaId, props.index] });
		}
	};

	return (
		<div className={`clipSegment ${isEditing ? 'editing' : ''}`}>
			<label className="matter-textfield-filled block">
				<input
					type="text"
					value={from}
					placeholder=" "
					onFocus={() => setEditingClipIndex()}
					onChange={e => setFrom(e.target.value)}
					onBlur={() => handleClipChange()}
					style={{ marginRight: '8px' }}
				/>
				<span>From</span>
			</label>

			<label className="matter-textfield-filled block">
				<input
					type="text"
					value={to}
					placeholder=" "
					onFocus={() => setEditingClipIndex()}
					onChange={e => setTo(e.target.value)}
					onBlur={() => handleClipChange()}
				/>
				<span>To</span>
			</label>

			<DelayedButton onDelayedClick={() => handleMove('up')} className="main grey">
				<span className="material-icons">arrow_upward</span>
			</DelayedButton>

			<DelayedButton onDelayedClick={() => handleMove('down')} className="main grey">
				<span className="material-icons">arrow_downward</span>
			</DelayedButton>

			<DelayedButton onDelayedClick={handleDeleteClip} className="main grey">
				<span className="material-icons">delete</span>
			</DelayedButton>
		</div>
	);
}
