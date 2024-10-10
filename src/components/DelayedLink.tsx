import { DelayedLinkBaseProps, initDelayedLink, Logger, LogLevels } from '@atas/weblib-ui-js';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import popupActions from 'src/redux/actions/popupActions';
import { useUIStore } from 'src/redux/reduxUtils';
import { showLoginPopup } from 'src/utils/displayPopup';

type DelayedLinkProps = Omit;
const logger = new Logger(DelayedLink, LogLevels.Info);

export default function DelayedLink(props: DelayedLinkProps) {
	const navigate = useNavigate();
	const BaseLink = initDelayedLink(popupActions, navigate, Link, logger, showLoginPopup);

	const isLoggedIn = useUIStore(state => state.my.isLoggedIn);

	return <BaseLink isLoggedIn={isLoggedIn} {...props} />;
}
