import { detectBrowser, Logger, LogLevels } from '@atas/weblib-ui-js';
import React from 'react';
import uiConfig from 'src/init/uiConfig';
import LoginHome from 'src/pages/auth/LoginPage';
import LoginPagePopup from 'src/pages/auth/LoginPagePopup';
import popupActions from 'src/redux/actions/popupActions';

export default new (class DisplayPopup {
	showFullScreenLoginPopup() {
		popupActions.fullScreenPopup({
			children: () => <LoginHome />,
			isOpen: true,
			title: 'Login',
		});
	}

	tryShowWelcomeRtaSitePopupIfNeeded() {
		const rtaConfirmPopupShown = localStorage.getItem('rtaConfirmPopupShown');
		if (rtaConfirmPopupShown) {
			return this.tryShowOldIOSVersionPopup();
		}

		localStorage.setItem('rtaConfirmPopupShown', '1');

		popupActions.popupMsg({
			title: `Restricted Content`,
			okayBtn: "I'm an adult & Enter",
			hideTopCloseButton: true,
			okayBtnClick: () => setTimeout(() => this.tryShowOldIOSVersionPopup(), 1000),
			content: () => (
				<div>
					<p>The content available on {uiConfig.site.name} may contain restricted content.</p>
				</div>
			),
			cancelBtn: 'Exit',
			cancelBtnClick: () => (window.location.href = 'https://www.google.com'),
		});
	}

	tryShowOldIOSVersionPopup() {
		if (!detectBrowser.isiOS() || detectBrowser.iOSVersion() >= 17) return;

		const logger = new Logger('tryShowOldIOSVersionPopup()', LogLevels.Info);

		logger.warn('iOS version is ', detectBrowser.iOSVersion());

		popupActions.popupMsg({
			title: 'OLD iOS',
			content: () => (
				<div>
					"YOU ARE USING AN OLD iOS VERSION. Everything may not work properly on the site. It's good to update
					your phone in Settings&raquo;General anyway. ",
				</div>
			),
			cancelBtn: null,
			hideTopCloseButton: true,
		});
	}
})();

export function showLoginPopup(redirUrl?: string, disableClosing: boolean = false) {
	popupActions.slidingPopup({
		isOpen: true,
		title: 'Easy Login',
		children: () => <LoginPagePopup redirUrl={redirUrl} />,
		disableClosing,
	});
}
