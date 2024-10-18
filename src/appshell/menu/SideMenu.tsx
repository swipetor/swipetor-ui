import {
	detectBrowser,
	getLoginUrlWithRedir,
	LogLevels,
	SideMenuBase,
	SimpleSnackbarVariant,
} from '@atas/weblib-ui-js';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';
import DelayedLink from 'src/components/DelayedLink';
import PushNotifPerm from 'src/init/PushNotifPerm';
import installAsApp from 'src/init/installAsApp';
import uiConfig from 'src/init/uiConfig';
import appshellActions from 'src/redux/actions/appshellActions';
import popupActions from 'src/redux/actions/popupActions';
import { UIState } from 'src/redux/reducers/reducers';
import IosAddToHomeTutorial from 'src/pages/others/IosAddToHomeTutorial';
import { UserRole } from 'src/types/enums';

async function pushNotifsToThisDeviceClick() {
	await new PushNotifPerm().request(true, true, false);
	popupActions.snackbarMsg('Done.', SimpleSnackbarVariant.success);
}

export default function SideMenu() {
	const showSideMenu = useSelector((state: UIState) => state.appshell.showSideMenu);
	const user = useSelector((state: UIState) => state.my.user);
	const isLoggedIn = useSelector((state: UIState) => state.my.isLoggedIn);
	const location = useLocation();

	const closeMenu = () => {
		appshellActions.sideMenu(false);
	};

	const selectedCss = (urlPrefix: string) => (location.pathname.startsWith(urlPrefix) ? 'selected' : '');

	const homeSelectedCss = () => {
		const path = location.pathname;
		return path.startsWith('/p/') || path === '/' ? 'selected' : '';
	};

	return (
		<SideMenuBase showSideMenu={showSideMenu} closeMenuFn={closeMenu} logLevel={LogLevels.Warn}>
			<DelayedButton onDelayedClick={() => closeMenu()} className="closeBtn">
				<span className="material-icons">cancel</span>
			</DelayedButton>

			<DelayedLink to={'/'} className={'logoImgLink'}>
				<img src="/public/swipetor/logo-underlined-slim-256.png" alt={`${uiConfig.site.name} Logo`} />
			</DelayedLink>

			{isLoggedIn && <div style={{ textAlign: 'center', margin: '15px 0 0 0' }}>Hi, {user?.username}</div>}

			<DelayedLink
				to={'/'}
				onClick={() => closeMenu()}
				className={`primaryLink ${homeSelectedCss()}`}
				style={{ marginTop: '10px' }}>
				<span className="material-icons">home</span> Home
			</DelayedLink>

			<DelayedLink
				to={'/post-builder'}
				loggedInOnly
				onClick={() => closeMenu()}
				className={`primaryLink ${selectedCss('/post-builder')}`}>
				<span className="material-icons">add</span> Post
			</DelayedLink>

			<DelayedLink
				to={'/favs'}
				loggedInOnly
				onClick={() => closeMenu()}
				className={`primaryLink ${selectedCss('/fav')}`}>
				<span className="material-icons">star</span> Favourites
			</DelayedLink>

			<div className="horizontalLine"></div>

			{isLoggedIn && (
				<DelayedLink
					to={`/my`}
					loggedInOnly
					onClick={() => closeMenu()}
					className={`secondaryLink ${selectedCss('/my')}`}>
					<span className="material-icons">person</span> My account
				</DelayedLink>
			)}

			{(user?.role || 0) >= UserRole.TenantAdmin && (
				<a href="/admin" target="_blank" onClick={() => closeMenu()} className="secondaryLink">
					<span className="material-icons">electric_bolt</span> Admin Panel
				</a>
			)}

			{!isLoggedIn && (
				<DelayedLink
					to={getLoginUrlWithRedir()}
					loggedInOnly
					target="_self"
					onClick={() => closeMenu()}
					className="secondaryLink"
					rel="noreferrer">
					<span className="material-icons">login</span> Login
				</DelayedLink>
			)}

			{installAsApp.hasEvent() && !(window.navigator as any).standalone && (
				<DelayedButton
					onDelayedClick={async () => {
						closeMenu();
						installAsApp.promptDirectly();
					}}
					className="secondaryLink">
					<>
						<span className="material-icons">apps</span> Install as app
					</>
				</DelayedButton>
			)}

			{(!detectBrowser.isiOS() || (window.navigator as any).standalone) && (
				<DelayedButton
					onDelayedClick={async () => pushNotifsToThisDeviceClick()}
					loggedInOnly
					onClick={() => closeMenu()}
					className="secondaryLink">
					<span className="material-icons">notifications_active</span> Enable Push Notifications
				</DelayedButton>
			)}

			{detectBrowser.isiOS() && !(window.navigator as any).standalone && (
				<>
					<DelayedButton
						onDelayedClick={() => {
							closeMenu();
							popupActions.fullScreenPopup({
								children: () => <IosAddToHomeTutorial />,
								isOpen: true,
								title: 'Get iOS Push Notifications',
							});
						}}
						className="secondaryLink">
						<>
							<span className="material-icons">notifications</span> Get push notifications
						</>
					</DelayedButton>
				</>
			)}

			<DelayedButton
				onDelayedClick={() => {
					closeMenu();
					window.location.href = window!.location.href;
				}}
				className="secondaryLink">
				<span className="material-icons">refresh</span> Refresh page
			</DelayedButton>

			{isLoggedIn && (
				<a href={`/api/auth/logout/${user?.id}`} onClick={() => closeMenu()} className="secondaryLink">
					<span className="material-icons">logout</span> Logout
				</a>
			)}

			<div className="horizontalLine"></div>

			<a
				href={'https://swipetor.com'}
				onClick={() => closeMenu()}
				target="_blank"
				className={`secondaryLink`}
				rel="noreferrer">
				<span className="material-icons">info</span> Open-source at{' '}
				<a href={'https://www.swipetor.com'} target={'_blank'} rel="noreferrer">
					Swipetor.com
				</a>
			</a>

			<div className="horizontalLine"></div>

			<div className="bottomInfo">
				<a href="/pages/privacy" onClick={() => closeMenu()} target="_blank">
					Privacy
				</a>
				<a href="/pages/terms" onClick={() => closeMenu()} target="_blank">
					Terms
				</a>
				<a
					href={'mailto:' + uiConfig.site.email}
					onClick={() => closeMenu()}
					target="_blank"
					rel="noopener noreferrer">
					{uiConfig.site.email}
				</a>
				<div className="versions">{uiConfig.site.name} &copy; 2024&nbsp;</div>
			</div>
		</SideMenuBase>
	);
}
