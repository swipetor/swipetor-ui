import React, { useMemo, useState } from 'react';
import DelayedButton from 'src/components/DelayedButton';
import { detectBrowser } from '@atas/webapp-ui-shared';
import postActions from 'src/redux/actions/postActions';
import pubsub from 'src/libs/pubsub/pubsub';

const storageKey = 'hideKeyboardAndSwipeHints';

export default function KeyboardAndSwipeHints() {
	const [hideHints, setHideHints] = useState(localStorage.getItem(storageKey) === 'true');
	const isTouchDevice = useMemo(() => detectBrowser.isTouchDevice(), []);

	const handleCloseClick = () => {
		localStorage.setItem(storageKey, 'true');
		setHideHints(true);
	};

	if (isTouchDevice || hideHints) return null;

	return (
		<div className="KeyboardAndSwipeHints">
			<div className="hint hintIcon">
				<span className="material-icons-outlined">{isTouchDevice ? 'info' : 'keyboard'}</span>
			</div>

			<div className="separator"></div>

			<div className="hint hasButton">
				<DelayedButton onDelayedClick={e => pubsub.publish('ScrollPost', { direction: 1 })}>
					Next Clip
					<span className="material-icons">arrow_downward</span>
				</DelayedButton>
			</div>

			<div className="separator"></div>

			<div className="hint hasButton">
				<DelayedButton onDelayedClick={e => postActions.playPause({ userInitiated: true })}>
					Play
					<span className="material-icons">space_bar</span>
				</DelayedButton>
			</div>

			<div className="separator"></div>

			<div className="hint hasButton">
				<DelayedButton onDelayedClick={e => postActions.mute()}>
					Mute
					<span className="textIcon">M</span>
				</DelayedButton>
			</div>

			<div className="separator"></div>

			<div className="closeIcon">
				<DelayedButton className="mainBtn" onDelayedClick={() => handleCloseClick()}>
					x
				</DelayedButton>
			</div>

			<div className="useMobileHint">Works better on iPhone & Android!</div>
		</div>
	);
}
