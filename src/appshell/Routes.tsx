import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SayInline from 'src/components/say/SayInline';
import installAsApp from 'src/init/installAsApp';
import FirstLogin from 'src/pages/firstLogin/FirstLogin';
import MyPage from 'src/pages/my/MyPage';
import FavPosts from 'src/post/FavPosts';
import PostBuilderHome from 'src/postBuilder/PostBuilderHome';
import myActions from 'src/redux/actions/myActions';
import LoginPage from 'src/pages/auth/LoginPage';
import { useGooglePageViewTracking, useMatomoPageView } from '@atas/weblib-ui-js';
import LoginEnterCode from 'src/pages/auth/LoginEnterCode';
import PostsPanel from 'src/post/PostsPanel';
import appshellActions from 'src/redux/actions/appshellActions';
import PmBoard from 'src/pages/pm/PmBoard';
import NotifPage from 'src/pages/notifs/NotifPage';
import UserProfile from 'src/pages/user/UserProfile';
import useRegisterServiceWorkerMessageEvent from 'src/hooks/useRegisterServiceWorkerMessageEvent';
import MyCustomDomain from 'src/pages/my/MyCustomDomain';
import { PostBuilderWithContext } from 'src/postBuilder/PostBuilderContext';
import BecomeCreator from 'src/pages/user/BecomeCreator';
import SubPlansList from 'src/pages/subPlans/SubPlansList';
import { CreatorOnly, LoggedInOnly } from 'src/appshell/authRoutes';
import QuickPost from 'src/postBuilder/QuickPost';

let urlChangesCounter = 0;

export default function AppRoutes() {
	const location = useLocation();
	useMatomoPageView();
	useGooglePageViewTracking();
	useRegisterServiceWorkerMessageEvent();

	useEffect(() => {
		appshellActions.updateLastUrlChange();
		window.scrollTo(0, 0);
		myActions.tryRegisterAutoPing();
		if (urlChangesCounter++ > 10) installAsApp.shouldShowInstallPopup();
	}, [location.pathname, location.search]);

	return (
		<div id="appBody">
			<SayInline />
			<Routes>
				<Route path="/" element={<PostsPanel />} />
				<Route path="/p/:postId?" element={<PostsPanel />} />
				<Route path="/p/:postId/:titleSlug" element={<PostsPanel />} />
				<Route path="/u/:userId/:username?" element={<UserProfile />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/login/code" element={<LoginEnterCode />} />
				<Route path="/my/first-login" element={<LoggedInOnly elem={<FirstLogin />} />} />
				<Route path="/favs" element={<LoggedInOnly elem={<FavPosts />} />} />
				<Route path="/notifs" element={<LoggedInOnly elem={<NotifPage />} />} />
				<Route path="/my" element={<LoggedInOnly elem={<MyPage />} />} />
				<Route path="/pm/*" element={<LoggedInOnly elem={<PmBoard />} />} />
				<Route path="/become-creator" element={<LoggedInOnly elem={<BecomeCreator />} />} />
				<Route path="/post-builder/:postId" element={<CreatorOnly elem={<PostBuilderWithContext />} />} />
				<Route path="/post-builder" element={<CreatorOnly elem={<PostBuilderHome />} />} />
				<Route path="/sub-plans" element={<CreatorOnly elem={<SubPlansList />} />} />
				<Route path="/my/custom-domain" element={<CreatorOnly elem={<MyCustomDomain />} />} />
				<Route path="/quick-post" element={<LoggedInOnly elem={<QuickPost />} />} />
			</Routes>
		</div>
	);
}
