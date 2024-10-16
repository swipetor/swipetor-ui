import { Action } from 'redux';
import { PostForUser } from 'src/types/DTOs';
import StateActionType from '../actions/stateActionType';

export type AnyPost = PostForUser;

export type PostWithIndex<T extends AnyPost = AnyPost> = {
	index: number;
} & T;

export interface PostState {
	posts?: PostWithIndex[];
	indexCounter: number;
	pix: number;
	mix?: number;
	isMuted: boolean;
	isPlaying: boolean;
	isFullScreen: boolean;
	touchingArea: false | 'left' | 'right' | 'middle';
}

const initialState: PostState = {
	pix: 0,
	indexCounter: 0,
	isMuted: localStorage.getItem('isMuted') === 'true',
	isPlaying: false,
	isFullScreen: false,
	touchingArea: false,
};

export default function (state = initialState, action: Action): PostState {
	if (action.type === StateActionType.POST_ADD) {
		const a = action as PostAddAction;
		let indexCounter = state.indexCounter;

		const posts = [...(state.posts || [])];

		for (const post of a.posts) {
			posts.push({ ...post, index: indexCounter++ });
		}

		return {
			...state,
			posts,
			indexCounter,
		};
	}

	if (action.type === StateActionType.POST_UPDATE) {
		const a = action as PostUpdateAction;
		const p = a.post;

		if (!state.posts) return state;

		const posts = [...state.posts];
		for (let i = 0; i < (state.posts.length || 0); i++) {
			if ((state.posts[i] as PostForUser).id == p.id) {
				posts[i] = { ...p, index: state.posts[i].index };
			}
		}

		return {
			...state,
			posts,
		};
	}

	if (action.type === StateActionType.POSTS_CLEAR) {
		return {
			...state,
			posts: undefined,
			pix: 0,
			mix: 0,
			indexCounter: 0,
			isPlaying: false,
		};
	}

	if (action.type === StateActionType.POST_SET_PLAYING) {
		const a = action as PostSetPlayingAction;
		return { ...state, isPlaying: a.isPlaying };
	}

	if (action.type === StateActionType.POST_SET_MUTED) {
		const a = action as PostSetMutedAction;

		localStorage.setItem('isMuted', a.isMuted ? 'true' : 'false');

		return { ...state, isMuted: a.isMuted };
	}

	if (action.type === StateActionType.POST_SET) {
		const a = action as PostSetActivated;
		return {
			...state,
			pix: a.pix,
			mix: a.mix,
		};
	}

	if (action.type === StateActionType.POST_FAV_ACTION) {
		const a = action as PostFavAction;

		const posts = state.posts?.map(post => {
			if (post.id === a.postId) {
				return { ...post, userFav: a.isFav };
			}
			return post;
		});

		return {
			...state,
			posts,
		};
	}

	if (action.type === StateActionType.POST_REVEAL) {
		const a = action as PostRevealAction;

		const posts = state.posts?.map(post => {
			const p = post as PostWithIndex<PostForUser>;
			if (p.id === a.postId) {
				// Create a new array of medias with updated properties
				const updatedMedias = p.medias.map(m => ({
					...m,
					isFollowersOnly: false,
				}));
				// Return a new post object with the updated medias array
				return { ...post, medias: updatedMedias };
			}
			return post;
		});

		return {
			...state,
			posts,
		};
	}

	if (action.type === StateActionType.POST_USER_FOLLOWS) {
		const a = action as PostUserFollowsAction;

		const posts = state.posts?.map(post => {
			if (post.type === 'PostForUser') {
				const p = post as PostWithIndex<PostForUser>;

				if (p.user && p.userId === a.userId) {
					return { ...p, user: { ...p.user, userFollows: a.userFollows }};
				}
			}
			return post;
		});

		return {
			...state,
			posts,
		};
	}

	if (action.type === StateActionType.POST_TOUCHING_AREA) {
		const a = action as PostTouchingAreaAction;
		return {
			...state,
			touchingArea: a.touchingArea,
		};
	}

	return state;
}
export interface PostsClearAction extends Action<StateActionType.POSTS_CLEAR> {}

export interface PostAddAction extends Action<StateActionType.POST_ADD> {
	posts: AnyPost[];
}

export interface PostUpdateAction extends Action<StateActionType.POST_UPDATE> {
	post: PostForUser;
}

export interface PostSetActivated extends Action<StateActionType.POST_SET> {
	pix: number;
	mix: number;
}

export interface PostSetMutedAction extends Action<StateActionType.POST_SET_MUTED> {
	isMuted: boolean;
}

export interface PostSetPlayingAction extends Action<StateActionType.POST_SET_PLAYING> {
	isPlaying: boolean;
}

export interface PostFavAction extends Action<StateActionType.POST_FAV_ACTION> {
	postId: number;
	isFav: boolean;
}

export interface PostRevealAction extends Action<StateActionType.POST_REVEAL> {
	postId: number;
}

export interface PostUserFollowsAction extends Action<StateActionType.POST_USER_FOLLOWS> {
	userId: number;
	userFollows: boolean;
}

export interface PostTouchingAreaAction extends Action<StateActionType.POST_TOUCHING_AREA> {
	touchingArea: false | 'left' | 'right' | 'middle';
}
