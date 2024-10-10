///<reference types="webpack-env" />
import React from 'react';
import App from './appshell/App';
// TODO Re-enable sw.js
// import './init/initServiceWorker';
import { createRoot } from 'react-dom/client';
import './init/installAsApp';
import hubActions from './redux/actions/hubActions';
import myActions from './redux/actions/myActions';
import './styles/_style.less';
import { LogLevels, setViewportHeight, SimpleSnackbarVariant, SnackbarError } from '@atas/weblib-ui-js';
import popupActions from 'src/redux/actions/popupActions';
import pubsub from 'src/libs/pubsub/pubsub';

window.addEventListener('unhandledrejection', function (e) {
	if (e.reason.message === 'handled') {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	}

	if (e.reason instanceof SnackbarError) {
		popupActions.snackbarMsg(e.reason.message, SimpleSnackbarVariant.error);
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	}
});

// Sync current user's information, if exists.
hubActions.getGlobalHubs();
myActions.getMy();

window.addEventListener('visibilitychange', () => {
	myActions.tryRegisterAutoPing();
});

const viewportUpdate = () => {
	setViewportHeight(LogLevels.Warn);
};
viewportUpdate();
window.addEventListener('resize', viewportUpdate);
window.addEventListener('orientationchange', viewportUpdate);
window.addEventListener('visibilitychange', viewportUpdate);
window.addEventListener('load', viewportUpdate);
pubsub.subscribe('AppMounted', () => {
	const style = getComputedStyle(document.body);
	const insetTop = style.getPropertyValue('--safe-area-inset-top');
	viewportUpdate();
});

// After my results are loaded, if the user is logged in, ping immediately to refresh data.
myActions.onLoaded(async my => {
	//myActions.tryRegisterAutoPing();
});

// window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
// console.log(typeof promiseRejectionEvent.type);
// appshellActions.snackbarMsg('.', SimpleSnackbarVariant.error);
// });

const root = createRoot(document.getElementById('app')!);

if (module.hot) {
	module.hot.accept('./appshell/App.tsx', function () {
		root.render(<App />);
	});
}

root.render(<App />);
