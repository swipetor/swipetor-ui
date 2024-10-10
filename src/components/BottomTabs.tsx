import React from 'react';
import DelayedLink from './DelayedLink';
import { useUIStore } from 'src/redux/reduxUtils';
import { useLocation } from 'react-router-dom';
import appshellActions from 'src/redux/actions/appshellActions';
import DelayedButton from './DelayedButton';
import UploadedPhoto from 'src/components/UploadedPhoto';
import popupActions from 'src/redux/actions/popupActions';
import PostBuilderHomePopup from 'src/postBuilder/PostBuilderHomePopup';
import pmActions from 'src/redux/actions/pmActions';

export default function BottomTabs() {
	const isLoggedIn = useUIStore(s => s.my.isLoggedIn);
	const currentUser = useUIStore(s => s.my.user);
	const unreadPmCount = useUIStore(s => s.my.unreadPmCount);
	const unreadNotifCount = useUIStore(s => s.my.unreadNotifCount);
	const location = useLocation();

	function selectedCss(locs: string[]) {
		for (const loc of locs) {
			if (location.pathname === loc) return 'selected';

			if (loc.endsWith('*') && location.pathname.startsWith(loc.substring(0, loc.length - 1))) {
				return 'selected';
			}
		}
		return '';
	}

	const openSideMenu = () => {
		appshellActions.sideMenu(true);
	};

	return (
		<div id="bottomTabs">
			<DelayedLink to="/" className={selectedCss(['/', '/p/*'])}>
				<span className="material-icons">home</span>
			</DelayedLink>

			<DelayedLink
				to="/pm"
				title="Messages"
				loggedInOnly
				onInstantMobileClick={async () => isLoggedIn && pmActions.fetchThreads()}
				className={selectedCss(['/pm', '/pm/*'])}>
				<span className="material-icons">chat</span>
				{unreadPmCount > 0 && <div className="unreadBalloon">{unreadPmCount}</div>}
			</DelayedLink>

			<DelayedButton
				title="Add Post"
				onDelayedClick={() =>
					popupActions.fullScreenPopup({
						children: () => <PostBuilderHomePopup />,
						isOpen: true,
						title: 'Post Builder',
					})
				}
				className={selectedCss(['/post-builder', '/post-builder/*'])}>
				<span className="material-icons">control_point</span>
			</DelayedButton>

			<DelayedLink to="/notifs" loggedInOnly className={selectedCss(['/notifs'])}>
				<span className="material-icons">notifications</span>
				{(unreadNotifCount > 0 || isLoggedIn === false) && (
					<div className="unreadBalloon">{unreadNotifCount > 0 ? unreadNotifCount : 1}</div>
				)}
			</DelayedLink>

			<DelayedButton onDelayedClick={openSideMenu} className={`notifBtn ${selectedCss(['/my', '/my/*'])}`}>
				{isLoggedIn === true && currentUser?.photo ? (
					<UploadedPhoto size={64} photo={currentUser.photo} />
				) : (
					<span className="material-icons">menu</span>
				)}
			</DelayedButton>
		</div>
	);
}
