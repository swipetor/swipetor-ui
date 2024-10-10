import { UserDto } from 'src/types/DTOs';

export default interface MyApiResponse {
	user?: UserDto;
	unreadNotifCount: number;
	unreadPmCount: number;
}
