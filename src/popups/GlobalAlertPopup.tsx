import { initGlobalAlertPopupBase, PopupsState } from '@atas/weblib-ui-js';
import { connect } from 'react-redux';
import popupActions from 'src/redux/actions/popupActions';
import DelayedButton from 'src/components/DelayedButton';

const mapStateToProps = (state: { popups: PopupsState }) => ({
	...state.popups.globalAlertPopupProps,
});

export default connect(mapStateToProps)(initGlobalAlertPopupBase(popupActions, () => DelayedButton));
