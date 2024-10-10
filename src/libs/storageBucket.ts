import { StorageBucketBase } from '@atas/weblib-ui-js';
import uiConfig from 'src/init/uiConfig';

export default new (class StorageBucket extends StorageBucketBase {
	public readonly sprites: string;

	constructor() {
		super(uiConfig.storage.bucketNamePrefix, uiConfig.storage.bucketNameSuffix);
		this.sprites = this._getBucketName('sprites');
		Object.freeze(this.sprites);
	}
})();
