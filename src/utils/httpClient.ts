import { LogLevels, Logger, initHttpClient } from '@atas/webapp-ui-shared';
import appshellActions from 'src/redux/actions/appshellActions';
import popupActions from 'src/redux/actions/popupActions';

const logger = new Logger('HttpClient', LogLevels.Info);
export default initHttpClient(appshellActions.loading, popupActions, logger);
