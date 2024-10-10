import { useEffect, useMemo } from 'react';
import postActions from 'src/redux/actions/postActions';
import { detectBrowser, intOrDefault } from '@atas/webapp-ui-shared';
import { useLocation, useParams } from 'react-router-dom';
import querystring from 'query-string';
import pubsub from 'src/libs/pubsub/pubsub';

/**
 * Auto scroll with up down arrows and space keys
 */
export function usePostsPanelKeyboardShortcuts() {
	useEffect(() => {
		if (detectBrowser.isTouchDevice()) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				console.log(event.key);
				pubsub.publish('ScrollPost', {});
			} else if (event.key === ' ') {
				postActions.playPause({ userInitiated: true });
				event.stopPropagation();
				event.preventDefault();
			} else if (event.key === 'm') {
				postActions.mute();
			} else if (event.key === 'ArrowRight') pubsub.publish('ScrollMedia', { direction: 1 });
			else if (event.key === 'ArrowLeft') pubsub.publish('ScrollMedia', { direction: -1 });
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
}

export function useUrlParams(explicitPostId?: number) {
	const location = useLocation();
	let postId = intOrDefault(useParams<{ postId: string }>().postId, undefined);

	if (explicitPostId) {
		postId = explicitPostId;
	}

	return useMemo(() => {
		const qs = querystring.parse(location.search);
		const hubId = intOrDefault(qs['hubId'] as string);
		const userId = intOrDefault(qs['userId'] as string, undefined);
		const firstPostId = postId;

		return {
			hubId,
			userId,
			firstPostId,
			postId,
		};
	}, [location.search, postId]);
}
