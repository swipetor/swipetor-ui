import { connect } from 'react-redux';
import popupActions from 'src/redux/actions/popupActions';
import DelayedButton from 'src/components/DelayedButton';
import { initFullScreenPopup, PopupsState } from '@atas/webapp-ui-shared';

const mapStateToProps = (state: { popups: PopupsState }) => ({ ...state.popups.fullScreenPopup });

export default connect(mapStateToProps)(initFullScreenPopup(popupActions, () => DelayedButton));
