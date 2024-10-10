// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotifData {}

export type PostThankNotifData = NotifData;

export interface NewPostNotifData extends NotifData {
	topicTitle: string;
	shortPostText: string;
}

export interface NewCommentNotifData extends NotifData {
	senderUserId: number;
	shortPostText: string;
}

export interface NewReferralPremiumNotifData extends NotifData {}
