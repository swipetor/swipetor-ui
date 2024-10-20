import React, { useEffect, useState } from 'react';
import { PostMediaDto } from 'src/types/DTOs';
import { Logger, LogLevels, secondsToHumanDuration } from '@atas/weblib-ui-js';
import { findFullVideoTimeByClip } from 'src/utils/videoUtils';

interface Props {
	totalDuration: number;
	currentTime: number;
	media: PostMediaDto;
	setCurrentTime: (time: number) => void;
}

const logger = new Logger('VideoProgressBar', LogLevels.Info);

const VideoProgressBar: React.FC<Props> = (props: Props) => {
	const progressBarRef = React.useRef<HTMLDivElement>(null);
	const [currentPercent, setCurrentPercent] = useState<number>(0);
	const currentPercentRef = React.useRef<number>(0);
	const [isClip, setIsClip] = useState<boolean>(false);
	const [isDragging, setIsDragging] = useState<boolean>(false);

	useEffect(() => {
		setIsClip((props.media.clipTimes || []).length > 0);
		let adjustedCurrentTime = props.currentTime;

		if (props.media.clippedVideo && props.media.clipTimes) {
			adjustedCurrentTime = findFullVideoTimeByClip(props.currentTime, props.media.clipTimes);
		}
		if (!isDragging) {
			setCurrentPercent(getLeftOffsetPc(adjustedCurrentTime));
			currentPercentRef.current = getLeftOffsetPc(adjustedCurrentTime);
		}
	}, [props.totalDuration, props.currentTime, props.media, isDragging]);

	const getLeftOffsetPc = (seconds: number) =>
		Math.min(Math.round((seconds / Math.round(props.totalDuration)) * 100), 100);

	const getWidthPc = (start: number, end: number) =>
		Math.min(((end - start) / Math.round(props.totalDuration)) * 100, 100);

	const handleMouseDown = () => {
		setIsDragging(true);

		const handleMouseMove = (event: MouseEvent | TouchEvent) => {
			if (!progressBarRef.current) return;

			const rect = progressBarRef.current.getBoundingClientRect();
			const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
			const offsetX = clientX - rect.left;
			const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
			setCurrentPercent(percent);
			currentPercentRef.current = percent;
		};

		const handleMouseUp = () => {
			const newTime = (currentPercentRef.current / 100) * props.totalDuration;
			props.setCurrentTime(newTime);
			setIsDragging(false);

			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('touchmove', handleMouseMove);

			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchend', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('touchmove', handleMouseMove);

		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchend', handleMouseUp);
	};

	const handleProgressBarClick = (event: React.MouseEvent | React.TouchEvent) => {
		if (!progressBarRef.current || isClip) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
		const offsetX = clientX - rect.left;
		const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
		const newTime = (percent / 100) * props.totalDuration;
		props.setCurrentTime(newTime);
	};

	return (
		<div
			ref={progressBarRef}
			className={`videoProgressBar ${isClip ? 'isClip' : ''}`}
			data-infinitescroll="no"
			onClick={handleProgressBarClick}>
			{(props.media.clipTimes || []).map((t, i) => (
				<div
					key={i}
					style={{
						left: getLeftOffsetPc(t[0]) + '%',
						width: getWidthPc(t[0], t[1]) + '%',
					}}
					className="clipPart"></div>
			))}

			<div className="totalDuration">{secondsToHumanDuration(props.totalDuration)}</div>
			{((isClip && currentPercent > 0) || (!isClip && currentPercent >= 0)) && (
				<div
					className="cursor"
					style={{ left: currentPercent + '%', cursor: !isClip ? 'pointer' : '' }}
					onMouseDown={e => !isClip && handleMouseDown()}
					onTouchStart={e => !isClip && handleMouseDown()}>
					<span className="material-icons">fiber_manual_record</span>
				</div>
			)}

			<div className="currentTime">{secondsToHumanDuration(props.currentTime)}</div>
		</div>
	);
};

export default VideoProgressBar;
