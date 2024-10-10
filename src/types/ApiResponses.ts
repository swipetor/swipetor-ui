import { NotifDto, PostForUser, PublicUserDto } from './DTOs';

export type NotifResult = {
	lastNotifCheckAt: number;
	notifs: NotifDto[];
};

export interface PostsGetApiResp {
	posts: PostForUser[];
}

export interface GetUsersApiResp {
	user: PublicUserDto;
	posts: PostForUser[] | null;
	canMsg: boolean | null;
	pmThreadId: number | null;
}
