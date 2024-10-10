import { detectBrowser } from '@atas/webapp-ui-shared';
import React, { useState } from 'react';
import { Mentions } from 'src/components/mentions';
import PushNotifPerm from 'src/init/PushNotifPerm';
import pmActions from 'src/redux/actions/pmActions';
import popupActions from 'src/redux/actions/popupActions';

interface Props {
	threadId: number;
	onSent: () => void;
	onFocus: () => void;
}

const WritePmMsg: React.FC<Props> = ({ threadId, onSent, onFocus }) => {
	const [txt, setTxt] = useState('');

	const sendClick = async () => {
		popupActions.fullScreenPopup({ isOpen: false });

		await pmActions.sendMsg(threadId, txt);
		setTxt('');

		onSent();

		new PushNotifPerm().requestWithAskPopupRandomly();
	};

	const onTxtChange = (newValue: string) => {
		setTxt(newValue);
	};

	const onKeyPress = async (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
			if (!detectBrowser.isMobileOrTablet()) {
				e.preventDefault();
				await sendClick();
			}
		}
	};

	return (
		<div className="writeMsgDiv">
			<div className="txtbox">
				<Mentions
					placeholder="Type... "
					onKeyDown={onKeyPress}
					value={txt}
					onChange={(e, newValue) => onTxtChange(newValue)}
					rows={1}
				/>
			</div>
			<div className="btn">
				<span className="material-icons-outlined" onClick={sendClick}>
					send
				</span>
			</div>
		</div>
	);
};

export default WritePmMsg;
