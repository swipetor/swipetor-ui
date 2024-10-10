import { PhotoUtilsBase } from '@atas/webapp-ui-shared';
import uiConfig from 'src/init/uiConfig';
import storageBucket from 'src/libs/storageBucket';

export default new (class PhotoUtils extends PhotoUtilsBase {
	constructor() {
		super(uiConfig.storage.mediaHost, storageBucket);
	}
})();
