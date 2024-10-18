import React from 'react';
import { intOrDefault, Logger, LogLevels } from '@atas/weblib-ui-js';
import postActions from 'src/redux/actions/postActions';

const logger = new Logger('PostScroller', LogLevels.Info);

/**
 * This class is used to detect which post is active by the scroll position.
 */
export default class PostScroller {
	private postsCnt: React.RefObject<HTMLDivElement>;

	constructor(bodyRef: React.RefObject<HTMLDivElement>) {
		this.postsCnt = bodyRef;
	}

	private _onScrollEventAttached = false;

	attachOnScrollEvent() {
		logger.info('Trying to attach scroll event to postsContainer');
		if (!this.postsCnt.current || this._onScrollEventAttached) return;
		this._onScrollEventAttached = true;
		this.postsCnt.current.addEventListener('scroll', this.onScroll, { passive: true });
		logger.info('Attached on scroll event to postsContainer');
	}

	removeOnScrollEvent() {
		if (!this.postsCnt.current || !this._onScrollEventAttached) return;
		this._onScrollEventAttached = false;
		this.postsCnt.current?.removeEventListener('scroll', this.onScroll);
		logger.verbose('Removed on scroll event from postsContainer');
	}

	private scrollTimeout: number | null = null;
	onScroll = () => {
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
		}

		this.scrollTimeout = setTimeout(() => {
			this.checkActivePost();
		}, 25) as any;

		// if (this.lastOnScrollCheckTime < Date.now() - 500) {
		// 	this.checkActivePost();
		// 	this.lastOnScrollCheckTime = Date.now();
		// }
	};

	checkActivePost() {
		logger.verbose('Running checkActivePost()');

		const cnt = this.postsCnt.current;
		if (!cnt) return logger.info('checkActivePost(): bodyRef.current is null');

		const topMostPost = this.getTopMostPost();
		if (!topMostPost) return;

		const newActivePostIndex = intOrDefault(topMostPost.getAttribute('data-post-index'));
		if (newActivePostIndex != null) {
			postActions.setActive(newActivePostIndex, 0);
			logger.info('TopMostElement is ', topMostPost, newActivePostIndex);
		} else {
			logger.error('newActivePostIndex is null or undefined for post', topMostPost, newActivePostIndex);
		}
	}

	private getTopMostPost(): Element | null {
		const postsCont = this.postsCnt.current;
		if (!postsCont) {
			return null;
		}

		let topMostPost: Element | null = null;
		let closestDistance = Infinity;

		const posts = postsCont.getElementsByClassName('singlePost');
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			const distance = post.getBoundingClientRect().top - postsCont.getBoundingClientRect().top;

			if (distance === 0) {
				closestDistance = distance;
				topMostPost = post;
			}

			// logger.info(`For singlePost[${i}] distance is`, distance, closestDistance);

			// If the distance is smaller than the current closest and is not negative
			// if (distance >= 0 && distance < closestDistance) {
			// 	closestDistance = distance;
			// 	topMostPost = post;
			// }
		}

		return topMostPost;
	}

	/**
	 * Gets the top most post element.
	 */
	/*	private getTopMostPost() {
		const postsCont = this.postsCnt.current;
		if (!postsCont) return null;

		let topMostElement: Element | null = null;
		let topMostElementTopDistance = Number.MAX_SAFE_INTEGER;

		for (const el of Array.from(postsCont.getElementsByClassName('singlePost'))) {
			const myTopDistance = this.calcTopDistance(el);
			if (myTopDistance < topMostElementTopDistance) {
				logger.info('TopMostElement is changed', myTopDistance, topMostElementTopDistance, el);
				topMostElement = el;
				topMostElementTopDistance = myTopDistance;
			}
		}

		return topMostElement;
	}*/

	private calcTopDistance(el: Element) {
		return Math.abs(
			el.getBoundingClientRect().top -
				window.innerHeight / 4 -
				this.postsCnt.current!.getBoundingClientRect().top,
		);
	}

	/**
	 * If somehow the top most element is not snapped, scroll to it.
	 */
	ensureTopElementSnapped() {
		const bodyEl = this.postsCnt.current;
		if (!bodyEl) return;

		logger.info('Ensuring if all elements are snapped.');

		const topMostElement = this.getTopMostPost();

		if (!topMostElement || this.calcTopDistance(topMostElement) >= 10) {
			logger.warn('Top element top distance is', this.calcTopDistance(topMostElement!));
			(topMostElement as any)?.scrollIntoView &&
				(topMostElement as any)?.scrollIntoView({
					behavior: 'smooth',
				});
		} else {
			logger.info(`Top post ${topMostElement.getAttribute('data-post-index')} is snapped.`);
		}
	}
}
