import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import NewVersionRefreshPage from 'src/appshell/NewVersionRefreshPage';
import Routes from 'src/appshell/Routes';
import SideMenu from 'src/appshell/menu/SideMenu';
import BottomTabs from 'src/components/BottomTabs';
import FCM from 'src/init/FCM';
import uiConfig from 'src/init/uiConfig';
import DomTreeGlobalPopup from 'src/popups/DomTreeGlobalPopup';
import FullScreenPopup from 'src/popups/FullScreenPopup';
import GlobalAlertPopup from 'src/popups/GlobalAlertPopup';
import GlobalSlidingPopup from 'src/popups/GlobalSlidingPopup';
import SharedSimpleSnackbar from 'src/popups/SharedSimpleSnackbar';
import myActions from 'src/redux/actions/myActions';
import { MyState } from 'src/redux/reducers/myReducer';
import store from 'src/redux/store';
import displayPopup from 'src/utils/displayPopup';
import pubsub from 'src/libs/pubsub/pubsub';

// Initialise Firebase Cloud Messaging
FCM.init();

const App: React.FC = () => {
	useEffect(() => {
		pubsub.publish('AppMounted', {});

		// Request push notification permissions if user has any posts
		myActions.onLoaded((my: MyState) => {
			// TODO push notifs can only be requested within a user interaction, refresh tokens in sw or in another event
			// my.user && new PushNotifPerm().requestSilentlyIfGranted();
		});

		if (uiConfig.site.isRta) {
			displayPopup.tryShowWelcomeRtaSitePopupIfNeeded();
		} else {
			displayPopup.tryShowOldIOSVersionPopup();
		}
	}, []);

	return (
		<Provider store={store}>
			<BrowserRouter>
				<SideMenu />

				<NewVersionRefreshPage />

				<Routes />

				<BottomTabs />

				<SharedSimpleSnackbar />
				<GlobalAlertPopup />

				{/* Show full screen dialog if called through redux actions */}
				<FullScreenPopup />
				<GlobalSlidingPopup />
				<DomTreeGlobalPopup />
			</BrowserRouter>
		</Provider>
	);
};

export default App;
