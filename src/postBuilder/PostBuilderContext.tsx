import React, { createContext, useContext, useEffect, useState } from 'react';
import { PostDto, PostMediaDto, SubPlanDto } from '../types/DTOs';
import { intOrDefault, SimpleSnackbarVariant } from '@atas/weblib-ui-js';
import { useParams } from 'react-router-dom';
import httpClient from 'src/utils/httpClient';
import PostBuilder from 'src/postBuilder/PostBuilder';
import popupActions from 'src/redux/actions/popupActions';

interface State {
	post?: PostDto;
	selectedHubIds: number[];
	isUpdating?: boolean;
	editingClipIndex?: [number, number]; //[mediaId, clipId]
	currentTime: { [mediaId: number]: number };
	subPlans: SubPlanDto[];
}

interface PostBuilderContextProps {
	s: State;
	refreshPost: () => void;
	updateS: (partialState: Partial) => void;
	updateMedia: (id: number, media: Partial) => void;
	submitUpdate: (isPublished: boolean) => void;
	setS: React.Dispatch;
}

const PostBuilderContext = createContext<PostBuilderContextProps | undefined>(undefined);

export function PostBuilderWithContext() {
	const postId = intOrDefault(useParams<{ postId: string }>().postId, 0);
	const [s, setS] = useState<State>({ selectedHubIds: [], currentTime: {}, subPlans: [] });

	useEffect(() => {
		refreshPost();
	}, [postId]);

	async function refreshPost() {
		const subPlansPromise = httpClient.get<SubPlanDto[]>(`/api/sub-plans`);
		const post = await httpClient.get<PostDto>(`/api/posts/${postId}`);
		const subPlans = await subPlansPromise;
		updateS({ post: post.data, selectedHubIds: post.data.hubs.map(c => c.id), subPlans: subPlans.data });
	}

	const updateS = (partialState: Partial) => {
		// console.log('Running updateS', partialState);
		// console.trace();

		setS(st => ({ ...st, ...partialState }));
	};

	const updateMedia = (id: number, media: Partial) => {
		if (!s.post) return;
		updateS({
			post: { ...s.post, medias: s.post.medias.map(m => (m.id === id ? { ...m, ...media } : m)) },
		});
	};

	async function submitUpdate(isPublished: boolean) {
		updateS({ isUpdating: true });

		try {
			await httpClient.put(
				`/api/posts/${s.post?.id}`,
				{
					hubIds: s.selectedHubIds,
					isPublished,
					items: s.post?.medias.map(m => ({
						id: m.id,
						description: m.description,
						isFollowersOnly: m.isFollowersOnly,
						subPlanId: m.subPlanId || null,
						clipTimes: m.clipTimes?.map(t => [t[0], t[1], t[2] || 0]),
					})),
				},
				{
					timeout: 300000,
				},
			);

			popupActions.snackbarMsg(isPublished ? 'Published' : 'Saved', SimpleSnackbarVariant.success);
			refreshPost();
		} finally {
			updateS({ isUpdating: false });
		}
	}

	return (
		<PostBuilderContext.Provider
			value={{
				s,
				refreshPost,
				updateS,
				updateMedia,
				submitUpdate,
				setS,
			}}>
			<PostBuilder />
		</PostBuilderContext.Provider>
	);
}

export const usePostBuilderContext = () => {
	const context = useContext(PostBuilderContext);
	if (context === undefined) {
		throw new Error('usePostBuilder must be used within a PostBuilderProvider');
	}
	return context;
};
