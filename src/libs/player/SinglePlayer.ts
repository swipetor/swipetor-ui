import { Logger, LogLevels } from '@atas/weblib-ui-js';
import { PostMediaDto } from 'src/types/DTOs';
import { getVideoUrl } from 'src/utils/videoUtils';
import postActions from 'src/redux/actions/postActions';

const loggerStyles = [
	'background: #FFA500; color: #000',
	'background: #00FF00; color: #000',
	'background: #979B8D; color: #000',
	'background: #FF8080; color: #000',
];

export default class SinglePlayer {
	playerId: number;
	videoElem: HTMLVideoElement;
	media?: PostMediaDto;

	private _tryingToPlay = false;
	private _warmingUp = false;
	private _keepPlayingAfterWarmUp = false;
	private _hasTouched = false;

	_pix: number = -1;
	_mix: number = -1;

	logger = new Logger('SinglePlayer', LogLevels.Warn, undefined, () => ({
		pix: this._pix,
		mix: this._mix,
		playerId: this.playerId,
	}));

	constructor(playerId: number, isMuted: boolean) {
		this.logger.infoStyle = loggerStyles[playerId];
		this.logger.warnStyle = loggerStyles[playerId];
		this.logger.errorStyle = loggerStyles[playerId];

		this.playerId = playerId;

		this.videoElem = document.createElement('video');
		this.videoElem.id = `video-player-${playerId}`;
		this.videoElem.playsInline = true;
		this.videoElem.loop = false;
		this.videoElem.controls = false;
		this.videoElem.preload = 'auto';
		this.videoElem.volume = 1;
		// this.videoElem.defaultMuted = true;
		this.videoElem.muted = isMuted;
		this.videoElem.autoplay = false;

		this.videoElem.onended = () => {
			if (this._hasTouched && !this._tryingToPlay && !this._warmingUp) {
				// this.logger.info('onended(): Video ended, playing again.');
				// this.setCurrentTime(0);
				// this.play();
			}
		};

		this.setVideoSource('/public/black_frame.mp4');
	}

	async play() {
		this.logger.info('play() called.');
		if (this._tryingToPlay) return this.logger.error('play(): Already trying to play.');

		// If play is called while warming up, keep playing after warm up
		if (this._warmingUp) return (this._keepPlayingAfterWarmUp = true);

		try {
			this._tryingToPlay = true;
			this._hasTouched = true;
			postActions.setPlayingStatus(true);
			await this.videoElem.play();
			this.logger.info('play succeeded.');
		} catch (e) {
			const error = e as Error;

			postActions.setPlayingStatus(false);

			if (error?.name === 'NotAllowedError' || error.message?.includes('interact')) {
				this.logger.info('Auto-play with sound needs user interaction first.', e);
			} else {
				this.logger.error('play(): Could not play the video.', e);
			}
		} finally {
			this._tryingToPlay = false;
		}
	}

	/**
	 * Touches the player upon user interaction, so it can autoplay later.
	 */
	async touch() {
		if (this._tryingToPlay) throw new Error('touch(): Already trying to play.');
		if (this._hasTouched) throw new Error('touch(): Already touched.');

		this.logger.info('touch() called.');

		this._tryingToPlay = true;
		this._hasTouched = true;

		await this.warmUp();
	}

	changeMedia(media: PostMediaDto, pix: number, mix: number) {
		if (media === this.media) return;

		this._pix = pix;
		this._mix = mix;

		this.logger.info('changeMedia(): called.');
		this.media = media;

		this.setVideoSource(getVideoUrl(media.clippedVideo || media.video) || '');
		this.videoElem.currentTime = 0;

		// If touched, warm up
		if (this._hasTouched) {
			this.warmUp();
		}
	}

	private async warmUp() {
		this.logger.info('warmUp(): called.');
		this._warmingUp = true;
		const mutedStatus = this.videoElem.muted;
		const currentTime = this.videoElem.currentTime;
		this.videoElem.muted = true; // mute while touching.
		try {
			await this.videoElem.play();
		} catch (e) {
			const error = e as Error;
			if (error?.name === 'NotAllowedError' || error.message?.includes('interact')) {
				this.logger.info('warmUp(): Auto-play with sound needs user interaction first.', e);
			} else {
				const error = e as Error;
				this.logger.error(`warmUp(): ${error?.name}`, e);
			}
		} finally {
			this._warmingUp = false;
			this._tryingToPlay = false;

			if (!this._keepPlayingAfterWarmUp) {
				this.videoElem.pause();
			} else {
				this.logger.info('warmUp(): Not pausing after warmUp() because _keepPlayingAfterWarmUp is false.');
				postActions.setPlayingStatus(true);
				this._keepPlayingAfterWarmUp = false;
			}

			this.videoElem.muted = mutedStatus;
			this.videoElem.currentTime = currentTime;
			this.logger.info('warmUp(): finished.');
		}
	}

	//region Events
	onEnded(event: (() => void) | null) {
		this.videoElem.onended = event;
	}
	//endregion

	//region Vanilla actions
	mute(isMuted: boolean) {
		this.videoElem.muted = isMuted;
	}

	onTimeUpdate(fn?: ((currentTime: number) => void) | null) {
		if (!fn) this.videoElem.ontimeupdate = null;
		else {
			this.videoElem.ontimeupdate = () => fn(this.videoElem.currentTime);
		}
	}

	pause() {
		if (this._tryingToPlay) return this.logger.error('pause(): Trying to play, should not pause.');

		if (this._warmingUp) {
			this.logger.info('pause(): Warming up, cannot pause.');
			this._keepPlayingAfterWarmUp = false;
			return;
		}

		this.logger.info(`pause() playerId: ${this.playerId}`);
		this.videoElem.pause();
	}

	isPaused() {
		return this.videoElem.paused;
	}

	setCurrentTime(seconds: number) {
		this.videoElem.currentTime = seconds;
	}

	moveInto(elem: HTMLDivElement) {
		this.logger.info(`Moving videoPlayer ${this.playerId} into element`, elem);
		elem.appendChild(this.videoElem);
	}
	//endregion

	private setVideoSource(sourceUrl: string) {
		this.logger.info(`setVideoSource(): Setting video source to ${sourceUrl}`);
		let sourceElement = this.videoElem.querySelector('source');
		if (sourceElement) {
			sourceElement.src = sourceUrl;
		} else {
			this.logger.info('setVideoSource(): Creating a new source element.');
			sourceElement = document.createElement('source');
			sourceElement.src = sourceUrl;
			sourceElement.type = 'video/mp4';
			this.videoElem.appendChild(sourceElement);
		}
		this.videoElem.load();
	}
}
