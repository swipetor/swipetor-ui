import React from 'react';
import { showLoginPopup } from 'src/utils/displayPopup';
import { DelayedButtonBase, DelayedButtonBaseProps } from '@atas/webapp-ui-shared';
import { useUIStore } from 'src/redux/reduxUtils';

const { showLoginPopupFn, isLoggedIn, ...rest } = {} as DelayedButtonBaseProps;
type DelayedButtonProps = typeof rest;
// type DelayedButtonProps = Omit<DelayedButtonBaseProps, "showLoginPopupFn" | "isLoggedIn">;

export default function DelayedButton(props: DelayedButtonProps) {
	const isLoggedInValue = useUIStore(s => s.my.isLoggedIn);

	return <DelayedButtonBase {...props} showLoginPopupFn={showLoginPopup} isLoggedIn={isLoggedInValue} />;
}
