import videojs from 'video.js';
import { getVideoUrl } from 'src/utils/videoUtils';
import { PostMediaDto } from 'src/types/DTOs';
import photoUtils from 'src/utils/photoUtils';
import { detectBrowser, Logger, LogLevels, MobileTap } from '@atas/weblib-ui-js';

export type VideoPlayer = ReturnType;

export class Oneplayer {
	player?: VideoPlayer;
	media?: PostMediaDto;
	logger = new Logger(Oneplayer, LogLevels.Warn);
	mobileTap = new MobileTap();

	private _onProgressFn?: () => void;
	private _onEnded?: () => void;
	private _onPlay?: () => void;
	private _onCanPlay?: () => void;
	private _onLoadedMetadata?: () => void;
	private _isExclusive = false;

	private _initialized = false;

	private _startTime = 0;

	init() {
		if (this._initialized) return;
		this._initialized = true;

		const onePlayerContainer = document.getElementById('onePlayerContainerEl');
		onePlayerContainer && (onePlayerContainer.style.display = '');

		const onePlayerEl = document.getElementById('onePlayerEl');
		onePlayerEl && (onePlayerEl.style.display = '');

		try {
			this.player = videojs(
				'onePlayerEl',
				{
					loop: false,
					autoplay: true,
					controlBar: false,
					muted: localStorage.getItem('isMuted') === 'true',
					defaultVolume: 100,
					bigPlayButton: false,
					poster: photoUtils.getSrcByPhotoOrNull(this.media?.previewPhoto) || undefined,
					preload: 'auto',
				},
				() => {
					this.logger.verbose(`onPlayerReady mediaId=${this.media?.id}`);
				},
			);
		} catch (e) {
			console.error('VideoJS player init error', e);
		}

		const playerClickHandler = (e: any) => !detectBrowser.isTouchDevice() && this.onVideoClick(e);
		this.player?.off('click', playerClickHandler); // Remove any existing click events, we attach our own.
		this.player?.on('click', playerClickHandler);
		this.player?.on('touchstart', (e: any) => detectBrowser.isTouchDevice() && this.mobileTap.start());
		this.player?.on('touchmove', (e: any) => detectBrowser.isTouchDevice() && this.mobileTap.move());
		this.player?.on(
			'touchend',
			(e: any) => detectBrowser.isTouchDevice() && this.mobileTap.tapped() && this.playPause(),
		);
		this.player?.on('play', (e: any) => this.onPlay());
		this.player?.on('timeupdate', () => this.onProgress());
		this.player?.on('canplay', () => this.onCanPlay());
		this.player?.on('loadedmetadata', () => {
			// this._ensureCurrentTime();
			this._onLoadedMetadata && this._onLoadedMetadata();
		});
		this.player?.on('onPlayerReady', () => {
			// this._ensureCurrentTime();
			this.play();
		});
		this.player?.on('ended', () => this.onEnded());

		this.registerPubSub();

		return this.player;
	}

	changeMedia(media: PostMediaDto, startTime = 0) {
		this.logger.info(`changeMedia called with mediaId`, media.id);
		this.init();

		this.hidePlayButtonTemporarily();

		this.pause();

		this._startTime = startTime;

		// Reset events
		this._onCanPlay = undefined;
		this._onPlay = undefined;
		this._onEnded = undefined;
		this._onProgressFn = undefined;
		this._onLoadedMetadata = undefined;

		this.media = media;

		if (this._isExclusive) this.player?.muted(true);

		this.player?.removeAttribute('src');

		this.player?.src({
			src: getVideoUrl(media.clippedVideo || media.video) || '',
			type: 'video/mp4',
		});

		if (media.previewPhoto) this.player?.poster(photoUtils.getSrcByPhoto(media.previewPhoto));

		this.play();
		return this;
	}

	registerPubSub() {
		PubSub.subscribe('video.settime', (msg, seconds: number) => {
			this.player?.currentTime(seconds);
			this.play();
		});

		// Lilsten to full screen toggles.
		PubSub.subscribe('video.fullscreen', (msg, value: boolean) => {
			this.fullScreenToggle();
		});

		// Lilsten to full screen toggles.
		PubSub.subscribe('video.playpause', (msg, value: boolean) => {
			this.logger.info(`PubSub:video.playpause triggered`);
			this.playPause();
		});
	}

	fullScreenToggle() {
		this.player?.isFullscreen() ? this.player?.exitFullscreen() : this.player?.requestFullscreen();
	}

	setIsLocked(isLocked: boolean) {
		this._isExclusive = isLocked;
		if (isLocked) {
			this.player?.muted(true);
		} else {
			this.player?.muted(localStorage.getItem('isMuted') === 'true');
		}
		return this;
	}

	getTime() {
		return this.player!.currentTime();
	}

	setTime(seconds: number) {
		this.player?.currentTime(seconds);
	}

	setMuted(isMuted: boolean) {
		if (!this._isExclusive) {
			this.player?.muted(isMuted);
		}
		return this;
	}

	playPause() {
		this.logger.info('PlayPause() called.');
		this.player?.paused() ? this.play() : this.pause();
	}

	getReadyState() {
		return (this.player as any)?.readyState();
	}

	async play() {
		this.logger.info(`PLAY mediaId:${this.media?.id}`);
		if (!this.player?.paused()) {
			this.logger.info('Already playing');
			return;
		}

		this.player?.autoplay(true); // In case player is not ready yet, let it play when it is so

		// if (this.player?.readyState() !== 4)
		// 	this.player?.on('canplay', () => {
		// 		this.player?.off('canplay');
		// 		this.play();
		// 	});

		// setTimeout(() => this.mutate({ canShowPlayButton: true }), 10);

		try {
			await this.player?.play();
		} catch (e) {
			if (!this.player?.muted()) {
				this.logger.warn('Could not play the video, possibly user needs interaction first.');
			} else {
				const error = e as Error;
				throw new Error('Could not play video.' + error.name + ' - ' + error.message);
			}
		}
	}

	pause() {
		this.logger.info(`PAUSE mediaId:${this.media?.id}`);
		this.player?.pause();
	}

	getJsPlayer() {
		if (!this.player) this.init();
		return this.player!;
	}

	getContainerElement() {
		return this.player?.el();
	}

	getElement() {
		return this.player?.el();
	}

	getDuration() {
		return this.player?.duration();
	}

	//region Events
	setOnPlay(fn: () => void) {
		this._onPlay = fn;
	}

	setOnLoadedMetadata(fn?: () => void) {
		this._onLoadedMetadata = fn;
	}

	setOnCanPlay(fn?: () => void) {
		this._onCanPlay = fn;
	}

	setOnProgressFn(fn: () => void) {
		this._onProgressFn = fn;
	}

	setOnEnded(fn: () => void) {
		this._onEnded = fn;
	}

	private onPlay() {
		this.logger.verbose(`HTML5 Video Element: Video playing mediaId=${this.media?.id}`, this.player?.currentSrc());

		// this._ensureCurrentTime();

		this._onPlay && this._onPlay();
	}

	private onCanPlay() {
		// this._ensureCurrentTime();
		this._onCanPlay && this._onCanPlay();
	}

	private onProgress() {
		this._onProgressFn && this._onProgressFn();
	}

	private onEnded() {
		this._onEnded && this._onEnded();
	}

	//endregion

	private hidePlayButtonTemporarily() {
		const playBtn = document.querySelector('#onePlayerEl .playButton');
		if (!playBtn) return;

		playBtn.classList.add('hidden');

		setTimeout(() => playBtn.classList.remove('hidden'), 500);
	}

	/**
	 * When video is clicked. This is not called on touch devices where touch events exist.
	 * @param e
	 */
	private onVideoClick(e: MouseEvent) {
		e.preventDefault();
		this.logger.info('onVideoClick() called.');
		this.playPause();
	}

	private _ensureCurrentTime() {
		const currentTime = this.player?.currentTime();
		if (currentTime && currentTime < this._startTime - 1) {
			this.player?.currentTime(this._startTime);
		}
	}
}

export default new Oneplayer();
