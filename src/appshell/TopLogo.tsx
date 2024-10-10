import React from 'react';
import { useLocation } from 'react-router-dom';
import DelayedLink from 'src/components/DelayedLink';
import userDeviceInfo from 'src/utils/userDeviceInfo';
import uiConfig from 'src/init/uiConfig';

export default function TopLogo() {
	const location = useLocation();
	let shouldShowLogo =
		!['', '/', '/camera', '/camera/photo', '/camera/video'].includes(location.pathname) &&
		!userDeviceInfo.isBot &&
		!location.pathname.startsWith('/p/');

	if (userDeviceInfo.isBot && location.pathname === '/') shouldShowLogo = true;

	if (!shouldShowLogo) return null;

	return (
		<div id="topLogo">
			<DelayedLink to="/" className="topLogoLink">
				<img
					src="/public/swipetor/logo-underlined-slim-256.png"
					alt={`${uiConfig.site.name} Logo`}
					title="Swipetor"
				/>
			</DelayedLink>
		</div>
	);
}
