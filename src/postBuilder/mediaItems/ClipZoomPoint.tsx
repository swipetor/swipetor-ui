import React, { useEffect, useRef, useState } from 'react';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';

interface Props {
	mediaId: number;
}

export default function ClipZoomPoint(props: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const [positionPercent, setPositionPercent] = useState(0); // Using percentage offset from the center
	const { s, updateMedia } = usePostBuilderContext();

	const [editingMediaId, editingClipIndex] = s.editingClipIndex || [];
	const clipTimes = s.post?.medias.find(m => m.id === props.mediaId)?.clipTimes;
	const editingClipTime = editingClipIndex !== undefined ? clipTimes?.[editingClipIndex] : undefined;

	useEffect(() => {
		if (editingClipTime && editingClipTime[2] !== undefined) {
			setPositionPercent(editingClipTime[2]);
		} else {
			setPositionPercent(0);
		}
	}, [editingClipIndex]);

	const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
		const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const initialPositionPercent = positionPercent;
		const videoContainer = ref.current?.parentElement;
		const containerRect = videoContainer?.getBoundingClientRect();

		if (editingClipTime == undefined) {
			return alert('Please select a clip to edit first.');
		}

		const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
			const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
			if (!containerRect) return;
			const dx = clientX - startX;
			const dxPercent = (dx / containerRect.width) * 100;
			let newPositionPercent = initialPositionPercent + dxPercent;
			if (newPositionPercent < -50) newPositionPercent = -50;
			if (newPositionPercent > 50) newPositionPercent = 50;
			setPositionPercent(newPositionPercent);

			if (editingClipTime && clipTimes && editingClipIndex !== undefined) {
				clipTimes[editingClipIndex] = [editingClipTime[0], editingClipTime[1], newPositionPercent];
				updateMedia(props.mediaId, { clipTimes: [...clipTimes] });
			}
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchmove', handleMouseMove);
			document.removeEventListener('touchend', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchmove', handleMouseMove);
		document.addEventListener('touchend', handleMouseUp);
	};

	const disabled = editingClipIndex === undefined;

	if (!clipTimes || clipTimes.length === 0) return null;

	return (
		<div>
			<div
				ref={ref}
				className={`clipZoomPoint ${disabled ? 'disabled' : ''}`}
				style={{
					left: `calc(50% + ${positionPercent}%)`,
				}}
				onMouseDown={handleMouseDown}
				onTouchStart={handleMouseDown}>
				<span className="material-icons">arrow_drop_up</span>
				<div className="text">Clip Zoom Center</div>
			</div>
		</div>
	);
}
