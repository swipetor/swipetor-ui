import { Logger, LogLevels } from '@atas/weblib-ui-js';
import ClipTimesFacade from 'src/libs/video/ClipTimesFacade';

interface CurrentTimeFn {
	currentTime(): number | undefined;
	currentTime(seconds: number): number | undefined;
}

export default class VideoLooper {
	logger = new Logger(VideoLooper, LogLevels.Warn);
	private currentTimeFn?: CurrentTimeFn;
	private clipTimes: number[][] | null;
	private currentPlayPartIx: number | null = 0;
	private _onEnded?: () => void;

	constructor(clipTimes: number[][] | null) {
		this.clipTimes = clipTimes;
		this.logger.info('Video looper initialized with times', clipTimes);
	}

	setCurrentTimeInterface(currentTimeFn: CurrentTimeFn) {
		this.currentTimeFn = currentTimeFn;
		return this;
	}

	/**
	 * This event needs to be registered to the player outside, don't register here in the class
	 */
	onTimeUpdateEvent() {
		this.logger.verbose('onTimeUpdateEvent()');
		const clipTimes = new ClipTimesFacade(this.clipTimes);
		const ts = clipTimes.getTimes();

		if (!ts || ts.length === 0 || !ts[0]) return;

		this.logger.verbose('ClipTimes', JSON.stringify(this.clipTimes));

		const time = this.currentTimeFn!.currentTime() || 0;

		// this.currentPlayPartIx = clipTimes.getCurrentIndex(time);
		this.currentPlayPartIx = ts.findIndex(t => time >= t.start - 1 && time <= t.end);
		this.logger.verbose(
			`Current play interval index=${this.currentPlayPartIx} for time at ${time}`,
			ts[this.currentPlayPartIx],
		);

		const nextPlayPartIx = ts.reduce(
			(prev: number | null, curr, i) =>
				ts[i].end > time && (prev === null || ts[i].start < ts[prev].start) ? i : prev,
			null,
		);

		this.logger.verbose(`Closest next index=${nextPlayPartIx}`, nextPlayPartIx ? ts[nextPlayPartIx] : null);

		// Go to next index once we are not within any play part (currentPartIndex === -1)
		if (this.currentPlayPartIx === -1 && nextPlayPartIx !== null && ts.length > 0) {
			this.logger.info('Jumping to the closest next clip time');
			this.currentTimeFn!.currentTime(ts[nextPlayPartIx].start);
		}
		// Go to first index
		else if (this.currentPlayPartIx === -1 && nextPlayPartIx === null && ts.length > 0) {
			this.logger.info('Going to the first clip time at second', ts[0].start);
			if (this._onEnded) {
				this._onEnded();
			} else {
				this.currentTimeFn!.currentTime(clipTimes.getStartTime());
			}
		}
		// else if (ts.length === 0) {
		// 	this.logger.info('Going to the beginning of the video');
		// 	// Go to beginning
		// 	this.player.currentTime(0);
		// }
	}

	updateClipTimes(clipTimes: number[][]) {
		this.logger.info('Updating video loop times', clipTimes);
		this.clipTimes = clipTimes;
	}

	getCurrentPartIndex() {
		return this.currentPlayPartIx || 0;
	}

	overrideOnEnded(fn?: () => void) {
		this._onEnded = fn;
	}
}
