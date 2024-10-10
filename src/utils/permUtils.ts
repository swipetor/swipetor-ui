import store from 'src/redux/store';
import { PostDto, UserDto } from 'src/types/DTOs';

export function canRemovePost(postId: number, user = store.getState().my.user) {
	if (!user) return false;
	return user.role >= 30;
}

export function canEditPost(post: PostDto, user?: UserDto) {
	if (!user) user = store.getState().my.user;
	return user && (user.role >= 30 || post.userId === user?.id);
}
