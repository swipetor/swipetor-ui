import uiConfig from 'src/init/uiConfig';
import { VideoDto } from '../types/DTOs';
import VideoResolution from '../types/VideoResolution';
import storageBucket from 'src/libs/storageBucket';

export function getVideoUrl(video?: VideoDto | null, format?: VideoResolution) {
	if (!video) return null;

	format ??= video.formats[0];

	return `https://${uiConfig.storage.mediaHost}/${storageBucket.videos}/${video.id}-${format.name}.${video.ext}`;
}

export function findFullVideoTimeByClip(currentPlayingTime: number, clipTimes: number[][]): number {
	let accumulatedTime = 0;

	for (const range of clipTimes) {
		const [start, end] = range;
		const clipLength = end - start;

		if (currentPlayingTime <= accumulatedTime + clipLength) {
			return start + (currentPlayingTime - accumulatedTime);
		}

		accumulatedTime += clipLength;
	}

	// If the currentPlayingTime is beyond the total length of the clips, return -1 or handle it as needed.
	return -1;
}
