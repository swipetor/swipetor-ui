import { Logger, LogLevels } from '@atas/weblib-ui-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import VideoProgressBar from 'src/pages/media/VideoProgressBar';
import { useUIStore } from 'src/redux/reduxUtils';
import { PostForUser, PostMediaDto } from 'src/types/DTOs';
import playerProvider from 'src/libs/player/playerProvider';
import SinglePlayer from 'src/libs/player/SinglePlayer';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

interface Props {
	currentPost: PostWithIndex<PostForUser>;
	currentMedia: PostMediaDto;
}

export default function PostVideo({ currentPost, currentMedia }: Props) {
	const playerContainerRef = useRef<HTMLDivElement>(null);
	const [currentSecond, setCurrentSecond] = useState<number>(0);

	const isPlaying = useUIStore(s => s.post.isPlaying);
	const activePix = useUIStore(s => s.post.pix);
	const activeMix = useUIStore(s => s.post.mix) ?? 0;
	const activePost = useUIStore(s => s.post.posts?.[activePix]);
	const isActiveMediaRef = useRef<boolean>(false);

	const currentMix = useMemo(
		() => currentPost.medias.findIndex(m => m.id === currentMedia.id) ?? -1,
		[currentPost, currentMedia],
	);

	const playerRef = useRef<SinglePlayer | null>(null);

	const logger = useMemo(
		() =>
			new Logger('PostVideo', LogLevels.Warn, undefined, () => ({
				'pix/mix': `${activePix}/${activeMix}`,
				currentPix: currentPost.index,
				currentMix,
				currentMediaId: currentMedia.id,
			})),
		[activePix, currentPost, activeMix, currentMix, currentMedia, activeMix],
	);

	useEffect(() => onActiveMediaChange(), [activePost, activeMix]);

	//region Conditions
	const isActiveMedia = () => {
		return activePix === currentPost.index && activeMix === currentMix;
	};

	const isEntitled = () => {
		if (!activePost || activeMix < 0 || currentMix < 0) return false;

		const allowedCurrentMix = [currentMix - 1, currentMix, currentMix + 1];

		// same post, should only be used for ix [0,0]
		if (activePix === currentPost.index && allowedCurrentMix.includes(currentMix)) return true;

		// next post first media
		if (activePix + 1 === currentPost.index && currentMix === 0) return true;

		return false;
	};
	//endregion

	//region Actions
	const onActiveMediaChange = () => {
		if (!activePost || activeMix < 0 || currentMix < 0) return;

		if (isEntitled()) {
			setEntitled(playerProvider.getPlayerForIndex(currentPost.index, currentMix));
		} else setNotEntitled();

		if (isActiveMedia()) {
			isActiveMediaRef.current = true;
			activateVideo();
		} else {
			isActiveMediaRef.current = false;
		}
	};

	/**
	 * This post video is not entitled to receive a video player.
	 * There should not be a video element within this component now.
	 */
	const setNotEntitled = () => {
		logger.info(`Post/Media ${currentPost.index}/${currentMix} NOT ENTITLED for a player. pix, mix, activePix`);
		playerRef.current = null;
		removeVideoElem();
	};

	/**
	 * We receive a new player to this post video component.
	 * This player should go into the playerContainerRef.
	 * @param player
	 */
	const setEntitled = (player: SinglePlayer | null) => {
		logger.info(`setEntitled()`);

		if (player === playerRef.current) return;

		if (!player || !playerContainerRef.current)
			return logger.error('setEntitled(): Invalid player or playerContainerRef.', {
				player,
				playerRef: playerRef.current,
				playerContainerRef: playerContainerRef.current,
			});

		playerRef.current = player;

		removeVideoElem();

		logger.info(`Moving video element #${player?.playerId} into playerContainerRef's div.`);
		player?.moveInto(playerContainerRef.current);
		player?.onTimeUpdate(time => setCurrentSecond(Math.floor(time)));

		logger.info('Video element here.', playerContainerRef.current.querySelector('video'));
	};

	/**
	 * If there is a video element within this PostVideo, remove it.
	 */
	const removeVideoElem = () => {
		const existingVidElem = playerContainerRef.current?.querySelector('video');
		if (existingVidElem) {
			logger.info('removeVideoElem(): Removing video element from this PostVideo');
			existingVidElem.remove();
		}
	};

	const activateVideo = () => {
		if (!activePost) return;

		const p = playerRef.current;
		if (!p) return logger.error('makeActiveMedia(): No player found!');

		playerProvider.play(activePix, activeMix);

		p.onEnded(() => {
			if (!isActiveMediaRef.current) return;
			logger.info('onEnded(): Video ended, restarting it.');
			p.setCurrentTime(0);
			p.play();
		});

		setTimeout(() => {
			playerProvider.printStatus();
		}, 500);
	};

	//endregion
	const setCurrentTime = (time: number) => {
		if (playerRef.current) {
			playerRef.current.setCurrentTime(time);
			setCurrentSecond(time);
		}
	};

	if (!currentMedia?.video && !currentMedia?.clippedVideo) return null;

	return (
		<div ref={playerContainerRef} className="playerContainer">
			<VideoProgressBar
				currentTime={currentSecond}
				media={currentMedia}
				totalDuration={currentMedia?.video?.duration || 0}
				setCurrentTime={setCurrentTime}
			/>

			<div className={`playButton ${isPlaying ? 'playing' : ''}`}>
				<span className="material-icons">play_arrow</span>
			</div>
		</div>
	);
}
