import React, { useEffect, useRef } from 'react';
import { useUIStore } from 'src/redux/reduxUtils';
import postActions from 'src/redux/actions/postActions';
import { detectBrowser, Logger, LogLevels } from '@atas/weblib-ui-js';
import wheelUtils from 'src/utils/wheelUtils';
import pubsub from 'src/libs/pubsub/pubsub';

const logger = new Logger('useInfiniteScroll', LogLevels.Verbose);
logger.infoStyle = 'background: #492E87; color: #FFF';

let touchStart = 0;
let touchStartTime = 0;
let touchEnd = 0;
let isTouching = false;
let wheelTurnedAt = 0;

export default function useInfiniteScroll(postsCont: React.RefObject<HTMLDivElement>) {
	if ((window as any).userDeviceInfo.isBot) return;

	const pix = useUIStore(s => s.post.pix);
	const activePostRef = useRef<HTMLDivElement | null>(null);
	const nextPostRef = useRef<HTMLDivElement | null>(null);
	const prevPostRef = useRef<HTMLDivElement | null>(null);
	const pixRef = useRef(pix);
	pixRef.current = pix;

	const SCROLL_THRESHOLD: number = postsCont.current ? Math.floor(postsCont.current?.clientHeight / 2) : 150;

	const useTouchEvents = detectBrowser.isTouchDevice();

	//region Events
	useEffect(() => {
		logger.info('Registering swipe events');
		const cont = postsCont.current;
		if (!cont) return logger.info('postsCont.current is null');

		const removeEventsFn = useTouchEvents ? registerTouchEvents(cont) : registerPointerEvents(cont);
		window.addEventListener('wheel', handleWheel, { passive: true });

		const scrollPostToken = pubsub.subscribe('ScrollPost', data => fullSwipe(0, 1));
		const scrollMediaToken = pubsub.subscribe('ScrollMedia', data => postActions.nextMedia(data.direction));

		return () => {
			logger.info('Removing events');
			removeEventsFn();
			window.removeEventListener('wheel', handleWheel);
			pubsub.unsubscribe(scrollPostToken);
			pubsub.unsubscribe(scrollMediaToken);
		};
	}, [postsCont.current]);

	useEffect(() => {
		setTimeout(() => resetActivePostStyle(), 100);
	}, [pix]);

	const registerTouchEvents = (cont: HTMLDivElement) => {
		const getTouch = (e: TouchEvent) => e.touches[0] || e.changedTouches[0];

		const touchStartFn = (e: TouchEvent) => onTapStart(getTouch(e).clientX, getTouch(e).clientY, e);
		const touchMoveFn = (e: TouchEvent) => onTapMove(getTouch(e).clientY, e);
		const touchEndFn = (e: TouchEvent) => onTouchEnd(getTouch(e).clientX, getTouch(e).clientY, e);

		cont.addEventListener('touchstart', touchStartFn, { passive: true });
		cont.addEventListener('touchmove', touchMoveFn, { passive: true });
		cont.addEventListener('touchend', touchEndFn, { passive: true });

		return () => {
			cont.removeEventListener('touchstart', touchStartFn);
			cont.removeEventListener('touchmove', touchMoveFn);
			cont.removeEventListener('touchend', touchEndFn);
		};
	};

	const registerPointerEvents = (cont: HTMLDivElement) => {
		const pointerDownFn = (e: PointerEvent) => onTapStart(e.clientX, e.clientY, e);
		const pointerMoveFn = (e: PointerEvent) => {
			if (e.pointerType === 'mouse' && e.buttons !== 1) return;
			onTapMove(e.clientY, e);
		};

		const pointerEndFn = (e: PointerEvent) => onTouchEnd(e.clientX, e.clientY, e);

		cont.addEventListener('pointerdown', pointerDownFn, { passive: true });
		cont.addEventListener('pointermove', pointerMoveFn, { passive: true });
		cont.addEventListener('pointerup', pointerEndFn, { passive: true });
		cont.addEventListener('pointercancel', onPointerCancel, { passive: true });
		cont.addEventListener('pointerleave', onPointerCancel, { passive: true });

		return () => {
			cont.removeEventListener('pointerdown', pointerDownFn);
			cont.removeEventListener('pointermove', pointerMoveFn);
			cont.removeEventListener('pointerup', pointerEndFn);
			cont.removeEventListener('pointercancel', onPointerCancel);
			cont.removeEventListener('pointerleave', onPointerCancel);
		};
	};

	const isEventTargetAllowed = (target: EventTarget | null) => {
		let currentElement: HTMLElement | null = target as HTMLElement;
		while (currentElement) {
			if (currentElement.dataset.infinitescroll === '0') {
				logger.verbose('Event target is not allowed data-infinitescroll=0', target, currentElement);
				return false;
			}
			if (currentElement.dataset.infinitescroll === '1') {
				logger.verbose('Event target is allowed data-infinitescroll=1', target, currentElement);
				return true;
			}
			currentElement = currentElement.parentElement;
		}

		logger.verbose('Event target is not allowed', target);
		return false;
	};

	const onTapStart = (clientX: number, clientY: number, e: UIEvent) => {
		e.stopPropagation();
		e.stopImmediatePropagation();
		if (!isEventTargetAllowed(e.target)) return;

		e.stopPropagation();

		// Wait for a second after last swipe up.
		// if (lastSwipeUpTime > Date.now() - 1000) return;

		logger.verbose('onTapStart()', clientX, clientY);
		isTouching = true;
		touchStart = clientY;
		touchEnd = clientY;
		touchStartTime = Date.now();

		activePostRef.current = getActiveSinglePost();
		nextPostRef.current = getNextPost();
		prevPostRef.current = getPreviousPost();
	};

	const onTapMove = (clientY: number, e: UIEvent) => {
		e.stopPropagation();
		e.stopImmediatePropagation();
		if (!isTouching || !isEventTargetAllowed(e.target)) return;

		e.stopPropagation();

		touchEnd = clientY;

		const travelledDistance = touchEnd - touchStart;
		if (travelledDistance > 0 && !prevPostRef.current) return; // No prev post to swipe back
		if (travelledDistance < 0 && !nextPostRef.current) return; // No next post to swipe back

		const activePost = getActiveSinglePost();
		const pos = touchEnd - touchStart;
		activePost.style.transition = '';
		activePost.style.transform = `translate3d(0px, ${pos}px, 0px)`;

		if (travelledDistance < 0) {
			const nextPost = getNextPost();
			nextPost.style.transition = '';
			nextPost.style.transform = `translate3d(0px, ${getCont().clientHeight + pos}px, 0px)`;
		} else if (travelledDistance > 0) {
			const prevPost = getPreviousPost();
			prevPost.style.transition = '';
			prevPost.style.transform = `translate3d(0px, ${-getCont().clientHeight + pos}px, 0px)`;
		}
	};

	const onTouchEnd = (clientX: number, clientY: number, e: UIEvent) => {
		e.stopPropagation();
		e.stopImmediatePropagation();
		if (!isTouching || !isEventTargetAllowed(e.target)) return;

		isTouching = false;

		logger.verbose('onTouchEnd()');

		const travelledPixels = touchEnd - touchStart;
		const travelledPixelsAbs = Math.abs(travelledPixels);

		if (travelledPixels > 0 && !prevPostRef.current) return; // No prev post to swipe back
		if (travelledPixels < 0 && !nextPostRef.current) return; // No next post to swipe back

		// Clicked
		if (travelledPixelsAbs < 15 && Date.now() - touchStartTime < 300) {
			logger.verbose("It's a click", clientX, clientY);
			resetActivePostStyle();
			return postActions.playPause({ userInitiated: true });
		}

		if (travelledPixelsAbs > calculateAdjustedThreshold(touchEnd)) {
			fullSwipe(travelledPixelsAbs, travelledPixels < 0 ? 1 : -1);
		} else {
			swipeBack(travelledPixelsAbs);
		}
	};

	const onPointerCancel = (e: PointerEvent) => {
		if (!isTouching || !isEventTargetAllowed(e.target)) return;

		isTouching = false;

		e.stopPropagation();

		const travelledDistance = Math.abs(touchStart - e.clientY);

		swipeBack(travelledDistance);

		logger.info('onPointerCancel(): why did this happen?');
		touchStart = 0;
	};

	const handleWheel = (e: WheelEvent) => {
		e.stopPropagation();

		const wheelTurningPixels = wheelUtils.convertDeltaYToPixels(e);

		logger.verbose('Wheel turning pixels', wheelTurningPixels);

		if (Math.abs(wheelTurningPixels) > 10 && wheelTurnedAt + 1000 < Date.now()) {
			wheelTurnedAt = Date.now();

			const nextPost = getNextPost();
			const prevPost = getPreviousPost();

			// No previous post
			if (wheelTurningPixels < 0 && !prevPost) return;
			if (wheelTurningPixels > 0 && !nextPost) return;

			fullSwipe(0, wheelTurningPixels > 0 ? 1 : -1);
		}
	};

	//endregion

	//region Calculation functions
	/**
	 * Calculates the scroll threshold based on the swipe duration and the travelled pixels
	 * @param touchEnd
	 */
	const calculateAdjustedThreshold = (touchEnd: number) => {
		const travelledPixels = Math.abs(touchStart - touchEnd);
		const swipeDuration = Date.now() - touchStartTime;

		let velocity = Math.pow(travelledPixels / swipeDuration + 1, 2);

		logger.verbose(
			`Swipe duration: ${swipeDuration}, travelledPixels: ${travelledPixels}, velocity: ${velocity}`,
			Math.min(Math.max(velocity, 1), 8.0),
		);

		velocity = Math.min(Math.max(velocity, 1), 10.0);

		const scroll_threshold = SCROLL_THRESHOLD / velocity;

		logger.verbose('Adjusted scroll threshold', scroll_threshold);

		return scroll_threshold;
	};

	const getAnimDurByTime = (travelledPixels: number, travelledTime: number, leftPixels: number) => {
		const velocity = travelledPixels / travelledTime;
		let animDur = leftPixels / velocity;
		animDur = Math.max(animDur, 100);
		animDur = Math.min(animDur, 400);
		logger.info('AnimDur', animDur);
		return animDur;
	};

	//endregion

	//region Utilities
	/**
	 * Returns the posts container or throws an exception
	 * @throws Error When posts container is not found
	 */
	const getCont = () => {
		if (!postsCont.current) throw new Error('postsCont.current is null');
		return postsCont.current;
	};

	/**
	 * Returns the active post or throws an exception
	 * @throws Error When active post not found
	 */
	const getActiveSinglePost = () => {
		const p = getCont().querySelector('.singlePost.active') as HTMLDivElement;
		if (!p) throw new Error('Active post is not found');
		return p;
	};

	const getNextPost = () => {
		return getCont().querySelector('.singlePost.next') as HTMLDivElement;
	};

	const getPreviousPost = () => {
		return getCont().querySelector('.singlePost.prev') as HTMLDivElement;
	};

	//endregion

	//region Styling functions
	/**
	 * Swipes the active post up
	 * @param travelledPixels
	 * @param direction
	 */
	const fullSwipe = (travelledPixels: number, direction: 1 | -1) => {
		logger.info(`fullSwipe(${travelledPixels}, ${direction}): Bumping active post from`, pixRef.current);

		const animDur = getAnimDurByTime(
			travelledPixels,
			Date.now() - touchStartTime,
			getCont().clientHeight - travelledPixels,
		);

		activePostRef.current = getActiveSinglePost();
		activePostRef.current!.style.transition = `transform ${animDur}ms linear`;
		activePostRef.current!.style.transform = `translate3d(0px, ${-direction * getCont().clientHeight}px, 0px)`;

		if (direction === 1) {
			nextPostRef.current = getNextPost();
			if (nextPostRef.current != null) {
				nextPostRef.current.style.transition = `transform ${animDur}ms linear`;
				nextPostRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
			}
		} else if (direction === -1) {
			prevPostRef.current = getPreviousPost();
			if (prevPostRef.current != null) {
				logger.verbose(`fullSwipe() Reverse animDur: ${animDur}`);
				prevPostRef.current.style.transition = `transform ${animDur}ms linear`;
				prevPostRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
			}
		}

		setTimeout(() => {
			postActions.setActive(pixRef.current + direction, 0);
			// playerProvider.play(pixRef.current + 1, 0);
		}, animDur);
	};

	/**
	 * Resets the active post to its original position instantly
	 */
	const resetActivePostStyle = () => {
		logger.verbose('resetActivePostStyle()');
		const allPosts = getCont().querySelectorAll<HTMLDivElement>('.singlePost:not(.next):not(.prev)');
		allPosts.forEach(p => {
			p.style.transition = '';
			p.style.transform = 'translate3d(0px, 0px, 0px)';
		});

		const nextPost = getNextPost();
		if (nextPost) {
			nextPost.style.transition = '';
			nextPost.style.transform = `translate3d(0px, ${getCont().clientHeight}px, 0px)`;
		}

		const prevPost = getPreviousPost();
		if (prevPost) {
			prevPost.style.transition = '';
			prevPost.style.transform = `translate3d(0px, ${-getCont().clientHeight}px, 0px)`;
		}
	};

	/**
	 * Resets the active post to its original position with animation
	 * @param travelledPixels Needed to calculate the animation duration
	 */
	const swipeBack = (travelledPixels: number) => {
		const animDur = 50;

		logger.info('swipeBack()', { animDur });

		activePostRef.current!.style.transition = `transform ${animDur}ms linear`;
		activePostRef.current!.style.transform = 'translate3d(0px, 0px, 0px)';

		if (nextPostRef.current) {
			nextPostRef.current.style.transition = `transform ${animDur}ms linear`;
			nextPostRef.current.style.transform = `translate3d(0px, ${getCont().clientHeight}px, 0px)`;
		}

		if (prevPostRef.current) {
			prevPostRef.current.style.transition = `transform ${animDur}ms linear`;
			prevPostRef.current.style.transform = `translate3d(0px, ${-getCont().clientHeight}px, 0px)`;
		}

		setTimeout(() => {
			resetActivePostStyle();
		}, animDur + 100);
	};
	//endregion
}
