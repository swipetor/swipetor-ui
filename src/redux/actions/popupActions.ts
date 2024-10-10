import { PopupActionsBase } from '@atas/webapp-ui-shared';
import store from 'src/redux/store';

export default new (class extends PopupActionsBase {
	constructor() {
		super(store);
	}
})();
