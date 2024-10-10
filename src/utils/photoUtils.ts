import { PhotoUtilsBase } from '@atas/weblib-ui-js';
import uiConfig from 'src/init/uiConfig';
import storageBucket from 'src/libs/storageBucket';

export default new (class PhotoUtils extends PhotoUtilsBase {
	constructor() {
		super(uiConfig.storage.mediaHost, storageBucket);
	}
})();
