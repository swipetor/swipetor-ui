import { secondsToHumanDuration } from '@atas/webapp-ui-shared';

export default class ClipTimesFacade {
	private _clipTimes: number[][];
	private _clipTimesObj;

	constructor(clipTimes: number[][] | undefined | null) {
		this._clipTimes = clipTimes || [];

		this._clipTimesObj = Object.freeze(
			this._clipTimes.map(t => ({
				start: t[0],
				end: t[1],
			})),
		);
	}

	getStartTime() {
		return this._clipTimesObj[0]?.start || 0;
	}

	getCurrentIndex(currentTime: number | null | undefined) {
		if (currentTime === null || currentTime === undefined) return -1;
		return this._clipTimes.findIndex(t => Math.ceil(currentTime) >= t[0] && Math.floor(currentTime) <= t[1]);
	}

	getNextIndex(currentIndex: number | null | undefined) {
		if (currentIndex === null || currentIndex === undefined || this._clipTimesObj.length === 0) return null;

		if (currentIndex >= this._clipTimesObj.length - 1) return 0;

		return currentIndex + 1;
	}

	getTimes() {
		return this._clipTimesObj;
	}

	getHumanReadableString() {
		return this._clipTimesObj
			?.map(t => `${secondsToHumanDuration(t.start, true)}-${secondsToHumanDuration(t.end, false)}`)
			.join(', ');
	}
}
