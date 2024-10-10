import { initSlidingPopup, Logger, LogLevels, SlidingPopupProps } from '@atas/webapp-ui-shared';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';

export default function SlidingPopup(props: SlidingPopupProps) {
	const navigate = useNavigate();

	const Component = initSlidingPopup(navigate, DelayedButton, new Logger('SlidingPopup', LogLevels.Warn));

	return <Component {...props} />;
}
