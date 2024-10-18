import { NotifDto, PostForUser, PublicUserDto } from './DTOs';
import { AnyPost } from 'src/redux/reducers/postReducer';

export type NotifResult = {
	lastNotifCheckAt: number;
	notifs: NotifDto[];
};

export interface PostsGetApiResp {
	posts: AnyPost[];
}

export interface GetUsersApiResp {
	user: PublicUserDto;
	posts: PostForUser[] | null;
	canMsg: boolean | null;
	pmThreadId: number | null;
}
