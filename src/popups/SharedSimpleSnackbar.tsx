import { shallowEqual } from 'react-redux';
import popupActions from 'src/redux/actions/popupActions';
import { useUIStore } from 'src/redux/reduxUtils';
import { initSimpleSnackbar } from '@atas/weblib-ui-js';

export default function SharedSimpleSnackbar() {
	const state = useUIStore(
		s => ({
			snackbarMsg: s.popups.snackbarMsg,
			snackbarVariant: s.popups.snackbarVariant,
			snackbarTimeout: s.popups.snackbarTimeout,
		}),
		shallowEqual,
	);

	return initSimpleSnackbar(
		{
			popupActions,
			...state,
		},
		popupActions,
	);
}
