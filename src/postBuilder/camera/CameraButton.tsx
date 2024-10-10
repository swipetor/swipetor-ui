import React, { useEffect, useRef, useState } from 'react';
import { Logger, LogLevels } from '@atas/weblib-ui-js';
import cameraUtils from 'src/utils/cameraUtils';

interface Props {
	isRecording: boolean;
	stream: MediaStream | null;
	startRecording: () => void;
	stopRecording: () => void;
	takeScreenshot: () => void;
}

let registeredTouchMoveEvent: ((event: TouchEvent) => void) | null = null;
let registeredTouchEndEvent: ((event: React.TouchEvent | TouchEvent) => void) | null = null;

export default function CameraButton(props: Props) {
	const logger = new Logger(CameraButton, LogLevels.Info);
	const [pressedTimer, setPressedTimer] = useState<number | undefined | NodeJS.Timeout>(0);
	const maxZoom = useRef<number | null>(null);
	const startTouchY = useRef<number>(0); // To track the starting Y position of the touch
	const propsRef = useRef<Props>(props);
	const currentZoomRef = useRef(0);
	propsRef.current = props;

	const handleTouchStart = (event: React.TouchEvent) => {
		event.stopPropagation();
		logger.info('handleTouchStart()');

		startTouchY.current = event.touches[0].clientY; // Set the initial Y position

		const timer = setTimeout(() => {
			propsRef.current.startRecording();
		}, 200);

		setPressedTimer(timer);
	};

	useEffect(() => {
		if (!props.isRecording) return;

		registeredTouchMoveEvent = handleTouchMove;
		registeredTouchEndEvent = handleTouchEnd;
		document
			.getElementById('cameraWrapper')
			?.addEventListener('touchmove', registeredTouchMoveEvent, { passive: true });
		document.getElementById('cameraWrapper')?.addEventListener('touchend', registeredTouchEndEvent);
	}, [props.isRecording]);

	const handleTouchEnd = (e: React.TouchEvent | TouchEvent): void => {
		logger.info('handleTouchEnd()');
		e.stopPropagation();
		e.preventDefault();

		if (pressedTimer) clearTimeout(pressedTimer);

		if (!propsRef.current.isRecording) {
			propsRef.current.takeScreenshot();
		} else {
			propsRef.current.stopRecording();
		}

		setZoom(0);

		logger.info('Removing document event listeners');

		registeredTouchMoveEvent &&
			document.getElementById('cameraWrapper')?.removeEventListener('touchmove', registeredTouchMoveEvent);
		registeredTouchEndEvent &&
			document.getElementById('cameraWrapper')?.removeEventListener('touchend', registeredTouchEndEvent);
	};

	const handleTouchMove = (event: TouchEvent): void => {
		event.stopPropagation();

		logger.info('Touch Move event', event.touches[0].clientY, startTouchY.current, window.innerHeight);

		const movementY = startTouchY.current - event.touches[0].clientY; // Calculate the upward movement
		const percentageOfScreen = Math.abs(movementY) / window.innerHeight;

		let zoomLevel = (maxZoom.current || 0) * percentageOfScreen * 8;
		zoomLevel = Math.max(0, Math.min(maxZoom.current || 0, zoomLevel));

		logger.info('handlePointerMove()', {
			maxZoom: maxZoom.current,
		});

		setZoom(zoomLevel);
	};

	useEffect(() => {
		(async () => {
			if (props.stream) {
				maxZoom.current = await cameraUtils.maxZoom(props.stream);
			}
		})();
	}, [props.stream]);

	const setZoom = (zoomLevel: number) => {
		if (!propsRef.current.stream) return;
		const zoomLevelToSet = Math.floor(zoomLevel);
		if (zoomLevelToSet === currentZoomRef.current) return;
		currentZoomRef.current = zoomLevelToSet;
		logger.info('Setting zoom level', zoomLevel);
		propsRef.current.stream.getVideoTracks()[0].applyConstraints({ advanced: [{ zoom: zoomLevelToSet } as any] });
	};

	return (
		<div className="captureButtonWrapper">
			<button
				className="captureButton"
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onMouseDown={e => {
					const evt = e as any;
					evt.touches = [{ clientY: e.clientY }];
					handleTouchStart(evt);
				}}
				onMouseUp={e => {
					const evt = e as any;
					evt.touches = [{ clientY: e.clientY }];
					handleTouchEnd(evt);
				}}
				onContextMenu={e => e.preventDefault()}
				style={{
					backgroundColor: props.isRecording ? 'red' : 'white',
				}}></button>
		</div>
	);
}
