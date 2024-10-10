export interface SayMsg {
	msg: string;
	color: 'info' | 'success' | 'warn' | 'error';
}

export enum SayMsgKey {
	userEmailChangeWrongLink = 'userEmailChangeWrongLink',
	userEmailChanged = 'userEmailChanged',

	unsubscribeLinkWrong = 'unsubscribeLinkWrong',
	unsubscribePmSuccessful = 'unsubscribePmSuccessful',
	unsubscribeNotifSuccessful = 'unsubscribeNotifSuccessful',

	userUpgradedCreator = 'userUpgradedCreator',
}

export const SayMsgs: { [k in SayMsgKey]: SayMsg } = {
	[SayMsgKey.userEmailChangeWrongLink]: {
		msg: 'Email change link was not valid.',
		color: 'error',
	},

	[SayMsgKey.userEmailChanged]: {
		msg: 'You have successfully changed your email address',
		color: 'success',
	},

	[SayMsgKey.unsubscribeLinkWrong]: {
		msg: 'The unsubscribe link was wrong.',
		color: 'error',
	},

	[SayMsgKey.unsubscribeNotifSuccessful]: {
		msg: 'Unsubscribed from notification emails.',
		color: 'success',
	},

	[SayMsgKey.unsubscribePmSuccessful]: {
		msg: 'Unsubscribed from PM emails.',
		color: 'success',
	},

	[SayMsgKey.userUpgradedCreator]: {
		msg: 'You have successfully upgraded to a Creator account!',
		color: 'success',
	},
};
