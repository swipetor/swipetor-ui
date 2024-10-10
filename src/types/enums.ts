/**
 * Notification type
 */
export enum NotifType {
	NewComment = 1,
	NewCommentReply = 2,
	UserMentionInComment = 3,
	NewPost = 4,
	NewReferralPremium = 6,
}

export enum LocationType {
	Continent = 1,
	Country = 2,
	Province = 3,
	City = 4,
}

export enum PostMediaType {
	Photo = 1,
	Video = 2,
}

export enum Currency {
	EUR = 'EUR',
	USD = 'USD',
	GBP = 'GBP',
}

export enum UserRole {
	Robot = 5,
	Default = 10,
	Creator = 20,
	TenantEditor = 30,
	TenantAdmin = 50,
	HostMaster = 99,
}
