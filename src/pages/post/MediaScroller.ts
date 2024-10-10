import postActions from 'src/redux/actions/postActions';
import { intOrDefault, Logger, LogLevels } from '@atas/weblib-ui-js';
import React from 'react';
import { PostWithIndex } from 'src/redux/reducers/postReducer';
import { PostForUser } from 'src/types/DTOs';

const logger = new Logger('MediaScroller', LogLevels.Info);

/**
 * This class is used to detect which media is active in the post by checking the horizontal scroll position.
 */
export default class MediaScroller {
	private mediaItemsCnt: React.RefObject;
	private post: PostWithIndex;

	constructor(mediaItemsCnt: React.RefObject, post: PostWithIndex) {
		this.mediaItemsCnt = mediaItemsCnt;
		this.post = post;
	}

	checkActiveMedia(activePostIndex: number) {
		const postMediasElem = this.mediaItemsCnt.current;
		if (!postMediasElem || this.post.index !== activePostIndex) return;

		let activeMediaSet = false;
		Array.from(postMediasElem.children).forEach((ele, index) => {
			if (Math.abs(ele.getBoundingClientRect().left - postMediasElem.getBoundingClientRect().left) < 10) {
				const activeMediaIndex = ele.getAttribute('data-media-index');

				if (!activeMediaIndex) throw new Error('data-media-index attribute not found on media element.');

				postActions.setActive(this.post.index, intOrDefault(activeMediaIndex, 0));
				activeMediaSet = true;
			}
		});
	}
}
