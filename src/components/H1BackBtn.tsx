import React from 'react';
import { useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';

interface Props {
	/**
	 * If no back page exists, this URL will be navigated.
	 */
	fallbackUrl?: string;
}

export default function H1BackBtn(props: Props) {
	const navigate = useNavigate();
	const handleBack = () => (window.history.length > 1 ? navigate(-1) : props.fallbackUrl || '/');

	return (
		<DelayedButton onDelayedClick={handleBack} className="main grey" style={{ marginRight: 10 }}>
			<span className="material-icons" style={{ fontSize: 18 }}>
				arrow_back
			</span>
		</DelayedButton>
	);
}
