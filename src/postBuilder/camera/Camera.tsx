import React, { useEffect, useRef, useState } from 'react';
import { Logger, LogLevels } from '@atas/weblib-ui-js';
import DelayedButton from 'src/components/DelayedButton';
import { useNavigate } from 'react-router-dom';
import CameraButton from 'src/postBuilder/camera/CameraButton';

function getInitialFacingMode() {
	const mode = localStorage.getItem('cameraFacingMode');
	return mode === 'environment' ? mode : 'user';
}

export default function Camera() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [facingMode, setFacingMode] = useState<'user' | 'environment'>(getInitialFacingMode);
	const navigate = useNavigate();
	const [recordingTimeout, setRecordingTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

	const logger = new Logger(Camera, LogLevels.Warn);

	useEffect(() => {
		let userMediaStream = null as MediaStream | null;
		async function getVideo() {
			try {
				const constraints: MediaStreamConstraints = {
					audio: false,
					video: { facingMode },
				};

				logger.info("Getting user's camera", constraints);
				userMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
				logger.info("Got user's camera", constraints, userMediaStream);
				setStream(userMediaStream);

				if (videoRef.current) {
					videoRef.current.srcObject = userMediaStream;
				}
			} catch (error) {
				console.error('Error accessing the camera:', error);
			}
		}

		getVideo()
			.then(() => logger.info('getVideo() ended'))
			.catch(logger.error);

		return () => {
			logger.info('Cleaning up camera component', stream);
			userMediaStream?.getTracks().forEach(track => track.stop());
		};
	}, [facingMode]);

	const takeScreenshot = () => {
		logger.info('takeScreenshot()', videoRef);
		if (!videoRef.current) return;

		const canvas = document.createElement('canvas');
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		const ctx = canvas.getContext('2d');
		ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
		canvas.toBlob(blob => {
			if (!blob) return;
			navigate('/camera/photo', { state: { photo: blob } });
		});
	};

	const startRecording = () => {
		logger.info('startRecording()');

		if (!stream || mediaRecorderRef.current?.state === 'recording') return;

		const mediaRecorder = new MediaRecorder(stream);
		mediaRecorderRef.current = mediaRecorder;
		mediaRecorder.start();
		setIsRecording(true);

		const chunks: any[] = [];
		mediaRecorder.ondataavailable = e => chunks.push(e.data);
		mediaRecorder.onstop = e => {
			const completeBlob = new Blob(chunks, { type: 'video/mp4' });
			logger.info('Recording stopped. Blob size', completeBlob.size);
			navigate('/camera/video', { state: { video: completeBlob } });
		};

		const timer = setTimeout(() => {
			if (mediaRecorder.state === 'recording') {
				logger.info('Stopping recording because it reached the time limit.');
				stopRecording();
			}
		}, 30000);
		setRecordingTimeout(timer);
	};

	const stopRecording = () => {
		logger.info('stopRecording()');
		recordingTimeout && clearTimeout(recordingTimeout);
		mediaRecorderRef.current?.stop();
		setIsRecording(false);
	};

	const cameraSwitch = () => {
		const mode = facingMode === 'user' ? 'environment' : 'user';
		localStorage.setItem('cameraFacingMode', mode);
		setFacingMode(mode);
	};

	return (
		<div id="cameraWrapper">
			<div className="leftBtns">
				<DelayedButton onDelayedClick={() => navigate('/')} className="main transparent cameraBtn backBtn">
					<span className="material-icons">arrow_back_ios</span>
				</DelayedButton>
			</div>

			<div className="rightBtns">
				<DelayedButton
					onDelayedClick={() => cameraSwitch()}
					className="main transparent cameraBtn cameraSwitchBtn">
					<span className="material-icons">cameraswitch</span>
				</DelayedButton>
			</div>

			<video className="cameraVideoElem" ref={videoRef} autoPlay playsInline />

			<CameraButton
				isRecording={isRecording}
				startRecording={startRecording}
				stopRecording={stopRecording}
				takeScreenshot={takeScreenshot}
				stream={stream}
			/>
		</div>
	);
}
