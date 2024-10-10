import { LocationType, NotifType, PostMediaType, UserRole } from './enums';
import VideoResolution from './VideoResolution';
import { NotifData } from 'src/types/notifTypes';
import CPrice from 'src/types/CPrice';

export class CustomDomainDto {
	domainName: string = '';
	userId: number = 0;
	recaptchaKey: string = '';
	recaptchaSecret: string = '';
}

export class HubDto {
	id = 0;
	name = '';
	description = '';
	lastPostAt = 0;
	ordering = 0;
	isPrivate = false;
	postCount = 0;
	isFav = false;
	readAt?: number;
	photo?: PhotoDto | null;
}

export class LocationDto {
	id = 0;
	name = '';
	nameAscii = '';
	fullName = '';
	lat: number | null = null;
	lng: number | null = null;
	iso2: string | null = null;
	iso3: string | null = null;
	type: LocationType = LocationType.City;
	parentId: number | null = null;
}

export class NotifDto<T extends NotifData = NotifData> {
	id = '';

	receiverUserId = 0;
	receiverUser?: UserDto;

	relatedPostId: number | null = null;
	relatedPost?: PostDto;

	relatedCommentId: number | null = null;
	relatedComment?: CommentDto;

	senderUserId: number | null = null;
	senderUser?: UserDto;
	senderUserPhoto?: PhotoDto;

	type: NotifType = NotifType.NewComment;
	data: T = {} as any;
	isRead = false;
	createdAt = 0;
}

export class PhotoDto {
	id = '';
	height = 0;
	width = 0;
	ext = '';
	sizes: number[] = [];
}

export class UserDto {
	id = 0;
	username = '';
	commentCount = 0;
	photoId: string | null = null;
	photo?: PhotoDto;
	description: string | null = null;
	locations: LocationDto[] | null = null;

	role = UserRole.Default;
	premiumUntil = 0;
}

export class PublicUserDto {
	id = 0;
	username = '';
	photoId: string | null = null;
	photo?: PhotoDto;
	description: string | null = null;
	userFollows: boolean = false;
}

export class PmThreadDto {
	id = 0;
	userCount = 0;
	isGroupChat = false;
	lastMsgId = 0;
	lastMsg?: PmMsgDto;
	lastMsgAt = 0;
	expirationDate = 0;
	createdAt = 0;
	msgs?: PmMsgDto[];
	threadUsers?: PmThreadUserDto[];
	unreadMsgCount = 0;
}

export class PmThreadUserDto {
	userId = 0;
	user?: UserDto;
	threadId = 0;
	lastReadMsgId = 0;
	unreadMsgCount = 0;
	lastMsgAt = 0;
	createdAt = 0;
}

export class PostDto {
	id = 0;
	title = '';
	userId = 0;
	user?: PublicUserDto;
	commentsCount = 0;
	favCount = 0;
	isPublished = false;
	isRemoved = false;
	createdAt = 0;
	hubs: HubDto[] = [];
	lastCommentIds: number[] = [];
	medias: PostMediaDto[] = [];
}

export class PmMsgDto {
	id = 0;
	threadId = 0;
	txt = '';
	userId = 0;
	user?: UserDto;
	createdAt = 0;
}

export class PostMediaDto {
	id = 0;
	postId = 0;
	photo?: PhotoDto;
	video?: VideoDto;
	clippedVideo?: VideoDto;
	previewPhotoId?: string | null;
	previewPhoto?: PhotoDto | null;
	clipTimes: number[][] | null = null;
	isFollowersOnly: boolean = false;
	subPlanId: number | null = null;
	subPlan: SubPlanDto | null = null;
	type: PostMediaType = PostMediaType.Photo;
	description: string | null = null;
	article: string | null = null;
	ordering = 0;
}

export class PostForUser extends PostDto {
	userFav: boolean = false;
	type = 'PostForUser';
}

export class CommentDto {
	id = 0;
	txt = '';
	postId = 0;
	userId = 0;
	ipAddress = '';
	createdAt = 0;
	user?: UserDto;
}

export class VideoDto {
	id = '';
	ext = '';
	sizeInBytes = 0;
	width = 0;
	height = 0;
	duration = 0;
	captions = 0;
	sprites?: SpriteDto[];
	formats: VideoResolution[] = [];
	createdAt = 0;
}

export class SpriteDto {
	id = '';
	videoId = 0;
	startTime = 0.0;
	interval = 0.0;
	thumbnailCount = 0;
	thumbnailWidth = 0;
	thumbnailHeight = 0;
}

export class SubDto {
	id: number = 0;
	userId: number = 0;
	startedAt: number = 0;
	endedAt?: number | null = null;
	isActive: boolean = false;
	planId: number = 0;
	plan: SubPlanDto = new SubPlanDto();
}

export class SubPlanDto {
	id: number = 0;
	name: string = '';
	description: string = '';
	cPrice: CPrice = { price: null, currency: null };
	ownerUserId: number = 0;
}
