import { Currency } from 'src/types/enums';

export default interface UIConfig {
	recaptcha: {
		key: string;
	};
	site: {
		name: string;
		baseDomain: string;
		hostname: string;
		email: string;
		slogan: string;
		userProfileTitle: string;
		userProfileDesc: string;
		defaultCurrency: Currency;
		isRta: boolean;
	};
	firebase: {
		appId: string;
		apiKey: string;
		projectId: string;
		authDomain: string;
		storageBucket: string;
		messagingSenderId: string;
		vapidKey: string;
	};
	storage: {
		mediaHost: string;
		bucketNamePrefix: string;
		bucketNameSuffix: string;
	};
}
