import { Logger, LogLevels, SimpleSnackbarVariant } from '@atas/weblib-ui-js';
import React, { useEffect, useRef, useState } from 'react';
import { VideoPlayer } from 'src/pages/media/oneplayer';
import VideoLooper from 'src/utils/VideoLooper';
import photoUtils from 'src/utils/photoUtils';
import { getVideoUrl } from 'src/utils/videoUtils';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import ClipSegmentsList from 'src/postBuilder/mediaItems/ClipSegmentsList';
import ClipZoomPoint from 'src/postBuilder/mediaItems/ClipZoomPoint';
import { PostMediaDto } from 'src/types/DTOs';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';
import { getValidClipTimes, validateClipTimes } from 'src/libs/video/clipTimesUtils';
import popupActions from 'src/redux/actions/popupActions';

const logger = new Logger('PostBuilderVideo', LogLevels.Warn);

export default function PostBuilderVideo({ media }: { media: PostMediaDto }) {
	const [looper, setLooper] = useState<VideoLooper | undefined>();
	const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
	const playerRef = useRef<HTMLVideoElement>(null);
	const player = useRef<VideoPlayer | null>(null);

	const { s, updateS } = usePostBuilderContext();

	useEffect(() => {
		if (!playerRef?.current) return;

		const playerOptions = {
			loop: true,
			autoplay: false,
			preload: 'none',
			poster: photoUtils.getSrcByPhotoOrNull(media.previewPhoto) || undefined,
			controlBar: {
				volumePanel: true,
				pictureInPictureToggle: false,
				fullscreenToggle: false,
				currentTimeDisplay: true,
				durationDisplay: true,
				remainingTimeDisplay: false,
			},
			inactivityTimeout: 0,
			sources: [
				{
					src: getVideoUrl(media.video) ?? '',
					type: 'video/mp4',
				},
			],
		};

		player.current = videojs(playerRef.current, playerOptions, function onPlayerReady() {
			console.log('onPlayerReady');
		});

		player.current.on('loadedmetadata', () => {
			const videoElement = playerRef.current;
			if (videoElement) {
				const { width, height } = videoElement.getBoundingClientRect();
				setVideoDimensions({ width, height });
			}

			const startTime = media.clipTimes && media.clipTimes.length > 0 ? media.clipTimes[0][0] || 0 : 0;
			if (startTime > 0) {
				player.current?.currentTime(startTime);
			}
		});

		// Add keydown event listener for seeking when the player is playing
		const handleSeek = (event: KeyboardEvent) => {
			if (!player.current || player.current.paused()) return;
			const currentTime = player.current.currentTime() || 0;
			const fullDuration = player.current.duration();
			const seekTime = 5; // Seek 5 seconds

			if (!fullDuration) return;

			switch (event.key) {
				case 'ArrowLeft':
					player.current.currentTime(Math.max(0, currentTime - seekTime));
					event.preventDefault();
					break;
				case 'ArrowRight':
					player.current.currentTime(Math.min(fullDuration, currentTime + seekTime));
					event.preventDefault();
					break;
			}
		};

		// Attach the keydown listener to the video player element
		if (player.current) {
			player.current.on('keydown', handleSeek);
		}

		// on current time change, set updateS(mediaId, currentTime)
		player.current.on('timeupdate', () => {
			updateS({ currentTime: { ...s.currentTime, [media.id]: player.current?.currentTime() || 0 } });
		});

		return () => {
			if (player.current) {
				player.current?.off('keydown', handleSeek);
				logger.info('Running player.current.dispose()');
				player.current.dispose();
			}
		};
	}, []);

	useEffect(() => {
		if (!player.current) return;

		logger.info('media.clipTimes changed', media.clipTimes);

		const validClipTimes = getValidClipTimes(media.clipTimes);

		logger.info('Valid clip times', validClipTimes);

		if (validClipTimes.length === 0) {
			player.current?.on('timeupdate', () => '');
			return;
		}

		if (!validateClipTimes(media.clipTimes)) {
			popupActions.snackbarMsg('Invalid clip times', SimpleSnackbarVariant.error);
			player.current?.on('timeupdate', () => '');
			return;
		}

		let loo = looper;
		if (!loo) {
			loo = new VideoLooper(validClipTimes);
			loo.setCurrentTimeInterface(player.current);
			setLooper(loo);
		}

		loo.updateClipTimes(validClipTimes);
		player.current?.on('timeupdate', () => loo.onTimeUpdateEvent());
	}, [media.clipTimes]);

	return (
		<>
			<div data-vjs-player>
				<video
					ref={playerRef}
					controls
					preload="none"
					width="100%"
					height="100%"
					playsInline
					className="video-js vjs-default-skin"
				/>
			</div>
			<ClipZoomPoint mediaId={media.id} />
			<ClipSegmentsList mediaId={media.id} />
		</>
	);
}
