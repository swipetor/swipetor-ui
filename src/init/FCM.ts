import { FcmBase, Logger, LogLevels } from '@atas/webapp-ui-shared';
import uiConfig from 'src/init/uiConfig';

export default new FcmBase(uiConfig.firebase, new Logger(FcmBase, LogLevels.Warn));
