// Extend MediaTrackCapabilities to include zoom
import { Logger, LogLevels } from '@atas/webapp-ui-shared';

interface MediaTrackCapabilitiesExtended extends MediaTrackCapabilities {
	zoom?: {
		max: number;
		min: number;
		step: number;
	};
}

async function maxZoom(stream: MediaStream) {
	const logger = new Logger(maxZoom, LogLevels.Info);
	try {
		const videoTrack = stream.getVideoTracks()[0];
		const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilitiesExtended;

		if (capabilities && capabilities.zoom) {
			const maxZoom = capabilities.zoom.max;
			logger.info('Maximum Zoom:', capabilities.zoom, maxZoom);
			return maxZoom;
		} else {
			logger.info('Zoom is not supported by this device camera');
			return null;
		}
	} catch (error) {
		logger.error('Error accessing camera:', error);
		return null;
	}
}

export default {
	maxZoom,
};
