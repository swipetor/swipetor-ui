export default {
	setCookie(
		name: string,
		value: string,
		opts: { days: number; rootDomain: boolean } = { days: 365, rootDomain: true },
	) {
		let expires = '';
		if (opts.days) {
			const date = new Date();
			date.setTime(date.getTime() + opts.days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie =
			name +
			'=' +
			(value || '') +
			expires +
			'; path=/; secure; ' +
			(opts.rootDomain ? 'domain=.swipetor.com' : '');
	},

	getCookie(name: string) {
		const nameEQ = name + '=';
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	},
};
