import uiConfig from 'src/init/uiConfig';
import popupActions from 'src/redux/actions/popupActions';
import store from '../redux/store';
import { InstallAsApp, registerBeforeInstallPromptEvent } from '@atas/webapp-ui-shared';

const installAsApp = new InstallAsApp(popupActions, uiConfig.site.name, () => store.getState().my.isLoggedIn);

registerBeforeInstallPromptEvent(installAsApp);

export default installAsApp;
