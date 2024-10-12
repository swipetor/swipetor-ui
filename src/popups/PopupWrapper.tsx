import { initPopupWrapper, Logger, LogLevels, PopupWrapperBase, PopupWrapperProps, Subtract } from '@atas/weblib-ui-js';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';
import popupActions from 'src/redux/actions/popupActions';
import { useUIStore } from 'src/redux/reduxUtils';

interface PropsFromState {
	isOpen: boolean;
}

type RequiredProps = Subtract<PopupWrapperProps, PropsFromState>;

export default function PopupWrapper(props: RequiredProps) {
	const isOpen = useUIStore(s => s.popups.globalPopup.isOpen);
	const navigate = useNavigate();

	initPopupWrapper(popupActions, navigate, () => DelayedButton, new Logger('PopupWrapper', LogLevels.Info));

	return <PopupWrapperBase isOpen={isOpen} {...props}></PopupWrapperBase>;
}
