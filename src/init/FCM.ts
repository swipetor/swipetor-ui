import { FcmBase, Logger, LogLevels } from '@atas/weblib-ui-js';
import uiConfig from 'src/init/uiConfig';

export default new FcmBase(uiConfig.firebase, new Logger(FcmBase, LogLevels.Warn));
