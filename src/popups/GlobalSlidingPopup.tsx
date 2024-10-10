import { initGlobalSlidingPopup } from '@atas/webapp-ui-shared';
import React from 'react';
import { useSelector } from 'react-redux';
import SlidingPopup from 'src/popups/SlidingPopup';
import popupActions from 'src/redux/actions/popupActions';
import { UIState } from 'src/redux/reducers/reducers';

export default function GlobalSlidingPopup() {
	const GlobalSlidingPopup = initGlobalSlidingPopup(popupActions, () => SlidingPopup);
	const props = useSelector((state: UIState) => state.popups.globalSlidingPopupProps);

	return <GlobalSlidingPopup {...props} />;
}
