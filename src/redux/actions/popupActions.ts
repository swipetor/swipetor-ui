import { PopupActionsBase } from '@atas/weblib-ui-js';
import store from 'src/redux/store';

export default new (class extends PopupActionsBase {
	constructor() {
		super(store);
	}
})();
