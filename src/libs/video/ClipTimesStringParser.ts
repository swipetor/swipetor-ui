/*
import popupActions from 'src/redux/actions/popupActions';
import { humanDurationToSeconds, SimpleSnackbarVariant } from '@atas/weblib-ui-js';

export default class ClipTimesStringParser {
	private _clipTimesStr?: string;

	private clipTimes?: number[][];

	constructor(clipTimesStr?: string) {
		this._clipTimesStr = clipTimesStr;
	}

	parseToArr(): number[][] | undefined {
		if (!this._clipTimesStr || this._clipTimesStr.trim() === '') return undefined;

		const regex =
			/^((\d{1,2}:)?(\d{1,2}:)?\d{1,2}-(\d{1,2}:)?(\d{1,2}:)?\d{1,2})(, *((\d{1,2}:)?(\d{1,2}:)?\d{1,2}-(\d{1,2}:)?(\d{1,2}:)?\d{1,2}))*$/;

		if (!regex.test(this._clipTimesStr)) {
			popupActions.snackbarMsg('Clip times is wrong', SimpleSnackbarVariant.error);
			return undefined;
		}

		const timesStrArray = this._clipTimesStr.split(/[, \n]/).filter(a => a.trim() !== '');

		if (timesStrArray.filter(a => a.trim().length > 0).length > 10) {
			popupActions.snackbarMsg(`Max 10 parts to play`, SimpleSnackbarVariant.error);
			return undefined;
		}

		this.clipTimes = [];

		for (const timesStr of timesStrArray) {
			const times = timesStr.split('-');
			const t0 = humanDurationToSeconds(times[0]);
			const t1 = humanDurationToSeconds(times[1]?.trim());

			if (times.length == 2) {
				if (t1 <= t0 || isNaN(t1)) {
					popupActions.snackbarMsg(
						`End time should be bigger than start. Check: ${times[0]}-${times[1]}`,
						SimpleSnackbarVariant.error,
					);
					return undefined;
				}

				this.clipTimes.push([t0, t1]);
			} else {
				popupActions.snackbarMsg(
					`Clip times format is wrong at ${times} as length was ${times.length}`,
					SimpleSnackbarVariant.error,
				);
				return undefined;
			}
		}

		return this.clipTimes;
	}
}
*/
