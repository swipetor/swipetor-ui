import { Logger, LogLevels } from '@atas/weblib-ui-js';

const logger = new Logger('wheelUtils', LogLevels.Warn);

export default {
	/**
	 * Convert the deltaY value from a wheel event to pixels
	 * @param e
	 */
	convertDeltaYToPixels(e: WheelEvent) {
		const LINE_HEIGHT = 16; // Average height of a line in pixels, adjust as needed
		const PAGE_HEIGHT = window.innerHeight; // Or an average page height in pixels

		switch (e.deltaMode) {
			case WheelEvent.DOM_DELTA_PIXEL:
				logger.info('WHEEL DOM_DELTA_PIXEL', e.deltaY);
				return e.deltaY; // Already in pixels
			case WheelEvent.DOM_DELTA_LINE:
				logger.info('WHEEL DOM_DELTA_LINE', e.deltaY);
				return e.deltaY * LINE_HEIGHT; // Convert lines to pixels
			case WheelEvent.DOM_DELTA_PAGE:
				logger.info('WHEEL DOM_DELTA_PAGE', e.deltaY);
				return e.deltaY * PAGE_HEIGHT; // Convert pages to pixels
			default:
				logger.error('WHEEL DEFAULT', e.deltaY);
				return e.deltaY; // Fallback, should not happen
		}
	},
};
