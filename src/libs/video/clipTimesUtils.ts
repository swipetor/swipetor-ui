export function validateClipTimes(clips?: number[][] | null): boolean {
	// Helper function to check if two clips overlap
	function clipsOverlap(clip1: number[], clip2: number[]): boolean {
		return clip1[1] > clip2[0] && clip1[0] < clip2[1];
	}

	if (!clips || clips.length === 0) {
		return true;
	}

	// Check each clip
	for (let i = 0; i < clips.length; i++) {
		const [startTime, endTime] = clips[i];

		// Check if start time is less than end time
		if (startTime >= endTime) {
			return false;
		}

		// Check for overlap with other clips
		for (let j = 0; j < clips.length; j++) {
			if (i !== j && clipsOverlap(clips[i], clips[j])) {
				return false;
			}
		}
	}

	return true;
}

export function getValidClipTimes(clips: (number | undefined)[][] | null | undefined): number[][] {
	if (!clips) {
		return [];
	}

	// Helper function to check if a clip is valid
	function isValidClip(clip: (number | undefined)[]): boolean {
		return clip.length >= 2 && typeof clip[0] === 'number' && typeof clip[1] === 'number' && clip[0] < clip[1];
	}

	// Filter out the valid clips
	return clips.filter(clip => isValidClip(clip)) as number[][];
}
