import { detectBrowser, openPopup } from '@atas/webapp-ui-shared';
import qs from 'query-string';
import React from 'react';

const uiConfig: any = {};

// TODO Strongly type the "any" type
export function ShareCard(props: any) {
	const getEncodedUrl = () => encodeURIComponent(window.location.href);

	function getShareText() {
		let text = '';
		if (props.city) {
			text = `Places to see in ${props.city.name}: ${window.location.href}`;
		}

		return encodeURIComponent(text);
	}

	function clickFacebook(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		// const url =
		// `https://www.facebook.com/sharer/sharer.php?u=${this.getEncodedUrl()}`;
		// openPopup(url, 'fbSharePopup', 600, 400);

		(window as any).FB.ui({
			method: 'share',
			link: window.location.href,
		});
	}

	function clickMessenger(e: React.MouseEvent<HTMLAnchorElement>) {
		if (!detectBrowser.isMobile()) {
			e.preventDefault();
			(window as any).FB.ui({
				method: 'send',
				link: window.location.href,
			});
		}
	}

	function getMessengerMobileShareUrl() {
		const params = {
			link: window.location.href,
			app_id: uiConfig.fb.appId,
		};

		return 'fb-messenger://share/?' + qs.stringify(params);
	}

	function clickTwitter(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault();
		const link = `https://twitter.com/home?status=${getShareText()}`;
		openPopup(link, 'twitterSharePopup', 600, 280);
	}

	function getMailtoLink() {
		const subject = encodeURIComponent(`Places to see in ${props.city!.name}`);
		const body = encodeURIComponent(
			`Hey,\n\nHere are some interesting places to see
			in ${props.city!.name}.\n\n${window.location.href}`,
		);
		return `mailto:?subject=${subject}&body=${body}`;
	}

	function getIconImg(iconName: string) {
		const size = detectBrowser.isMobile() ? '32' : '24';
		const iconUrl = `/images/${iconName}/${iconName}-${size}.png`;
		return <img src={iconUrl} alt="" />;
	}

	if (!props.city || !props.places) {
		return null;
	}

	return (
		<div className="sharerBox box">
			<div className="title">Share on</div>

			<div className="icons">
				<button>
					<a href={`whatsapp://send?text=${getShareText()}`} data-action="share/whatsapp/share">
						{getIconImg('whatsapp')}
					</a>
				</button>

				<button>
					<a href={getMessengerMobileShareUrl()} onClick={e => clickMessenger(e)}>
						{getIconImg('messenger')}
					</a>
				</button>

				<button>
					<a href="#" onClick={e => clickFacebook(e)}>
						{getIconImg('facebook')}
					</a>
				</button>

				<button>
					<a href="#" onClick={e => clickTwitter(e)}>
						{getIconImg('twitter')}
					</a>
				</button>

				<button>
					<a href={getMailtoLink()} target="_blank" rel="noopener noreferrer">
						{getIconImg('gmail')}
					</a>
				</button>
			</div>
		</div>
	);
}

export default ShareCard;
