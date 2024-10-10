import store from 'src/redux/store';
import StateActionType from 'src/redux/actions/stateActionType';
import {
	AnyPost,
	PostAddAction,
	PostFavAction,
	PostRevealAction,
	PostsClearAction,
	PostSetActivated,
	PostSetMutedAction,
	PostSetPlayingAction,
	PostUpdateAction,
	PostUserFollowsAction,
	PostWithIndex,
} from 'src/redux/reducers/postReducer';
import httpClient from 'src/utils/httpClient';
import { PostForUser } from 'src/types/DTOs';
import { PostsGetApiResp } from 'src/types/ApiResponses';
import { Logger, LogLevels } from '@atas/webapp-ui-shared';
import qs from 'query-string';
import playerProvider from 'src/libs/player/playerProvider';

const postActions = new (class PostActions {
	logger = new Logger(PostActions, LogLevels.Info);

	mute(isMuted?: boolean) {
		isMuted ??= !store.getState().post.isMuted;

		playerProvider.mute(isMuted);

		store.dispatch<PostSetMutedAction>({
			isMuted: isMuted,
			type: StateActionType.POST_SET_MUTED,
		});
	}

	clearPosts() {
		store.dispatch<PostsClearAction>({
			type: StateActionType.POSTS_CLEAR,
		});
	}

	addGenericPost(post: AnyPost) {
		store.dispatch<PostAddAction>({
			posts: [{ ...post }],
			type: StateActionType.POST_ADD,
		});
	}

	async fetchPosts(firstPostId?: number, userId?: number, hubIds?: number[]) {
		const params = {
			firstPostId: firstPostId || '',
			userId: userId || '',
			hubIds: hubIds ? hubIds?.join(',') : '',
		};

		const r = await httpClient.get<PostsGetApiResp>(`/api/posts?${qs.stringify(params)}`);

		store.dispatch<PostAddAction>({
			posts: r.data.posts.map(p => ({ ...p, type: 'PostForUser' })),
			type: StateActionType.POST_ADD,
		});

		return r.data;
	}

	async updateById(postId: number) {
		const r = await httpClient.get<PostForUser>(`/api/posts/${postId}`);

		store.dispatch<PostUpdateAction>({
			post: r.data,
			type: StateActionType.POST_UPDATE,
		});
	}

	/**
	 * Sets the playing status of the UI without affecting the player.
	 * @param isPlaying
	 */
	setPlayingStatus(isPlaying: boolean) {
		if (store.getState().post.isPlaying === isPlaying)
			return this.logger.info(`setPlayingStatus(): Already isPlaying=${isPlaying}`);

		store.dispatch<PostSetPlayingAction>({
			isPlaying,
			type: StateActionType.POST_SET_PLAYING,
		});
	}

	/**
	 * Toggles play/pause of the player.
	 */
	playPause(args: { pix?: number; mix?: number; userInitiated?: boolean } = {}) {
		if (args.pix === undefined || args.mix === undefined) {
			args.pix = store.getState().post.pix;
			args.mix = store.getState().post.mix;
			this.logger.info(`playPause(): using ix: ${args.pix}/${args.mix}`);
		} else {
			this.logger.info(`playPause(): called with ix: ${args.pix}/${args.mix}`);
		}

		this.play(!store.getState().post.isPlaying, args.pix, args.mix ?? 0, !!args.userInitiated);
	}

	play(isPlaying: boolean, pix: number, mix: number, userInitiated: boolean = false) {
		const postState = store.getState().post;

		if (postState.isPlaying === isPlaying)
			return this.logger.warn(`play(${isPlaying}, ${pix}, ${mix}): Already doing it`);

		isPlaying ? playerProvider.play(pix, mix, userInitiated) : playerProvider.pause(pix, mix);

		store.dispatch<PostSetPlayingAction>({
			isPlaying,
			type: StateActionType.POST_SET_PLAYING,
		});
	}

	setActive(pix: number, mix: number) {
		this.logger.info(`setActive(): ${pix}/${mix}`);

		store.dispatch<PostSetActivated>({
			pix,
			mix,
			type: StateActionType.POST_SET,
		});
	}

	nextMedia(direction: 1 | -1) {
		const { pix, mix } = store.getState().post;

		if (mix === undefined) return this.logger.error(`nextMedia(): mix is undefined`);

		const post = (store.getState().post.posts || [])[pix];

		if (!post)
			return this.logger.error(`nextMedia(): post doesn't exist, pix, mix, direction`, pix, mix, direction);

		const nextMix = mix + direction;

		this.logger.verbose(`nextMedia(): ${pix}/${nextMix}`);

		const p = post as PostWithIndex<PostForUser>;
		if (nextMix < 0 || nextMix >= p.medias.length) return;

		this.setActive(pix, nextMix);
	}

	async fav(postId: number, isFav: boolean) {
		if (isFav) {
			await httpClient.post(`/api/posts/${postId}/fav`);
		} else {
			await httpClient.delete(`/api/posts/${postId}/fav`);
		}

		store.dispatch<PostFavAction>({
			postId,
			isFav,
			type: StateActionType.POST_FAV_ACTION,
		});
	}

	reveal(postId: number) {
		store.dispatch<PostRevealAction>({
			postId,
			type: StateActionType.POST_REVEAL,
		});
	}

	userFollows(userId: number, userFollows: boolean) {
		store.dispatch<PostUserFollowsAction>({
			userId,
			userFollows,
			type: StateActionType.POST_USER_FOLLOWS,
		});
	}
})();

export default postActions;
