import {
	detectBrowser,
	getLoginUrlWithRedir,
	getUrlToRedirectOrCurrentUrl,
	SimpleSnackbarVariant,
} from '@atas/weblib-ui-js';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mentions } from 'src/components/mentions';
import PushNotifPerm from 'src/init/PushNotifPerm';
import popupActions from 'src/redux/actions/popupActions';
import { UIState } from 'src/redux/reducers/reducers';
import { showLoginPopup } from 'src/utils/displayPopup';
import httpClient from 'src/utils/httpClient';

interface Props {
	postId: number;
	close(): void;
}

export default function WriteComment(props: Props) {
	const [txt, setTxt] = useState('');
	const isLoggedIn = useSelector((state: UIState) => state.my.isLoggedIn);
	const navigate = useNavigate();

	const submit = async () => {
		if (isLoggedIn === false) return navigate(getLoginUrlWithRedir());

		// In case this is sent in the full screen popup
		popupActions.fullScreenPopup({ isOpen: false });

		await httpClient.post(`/api/comments`, {
			txt: txt,
			postId: props.postId,
		});
		props.close();

		setTxt('');

		popupActions.snackbarMsg('Comment sent.', SimpleSnackbarVariant.success);

		// Request push notifications
		new PushNotifPerm().requestWithAskPopupRandomly();
	};

	const onTxtChange = (txt: string) => setTxt(txt);

	const onKeyPress = async (e: React.KeyboardEvent) => {
		e.stopPropagation();
		if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
			if (!detectBrowser.isMobileOrTablet()) {
				e.preventDefault();
				await submit();
			}
		}
	};

	return (
		<div className="writeCommentDiv">
			<div
				className="txtbox"
				onClick={() => isLoggedIn === false && showLoginPopup(getUrlToRedirectOrCurrentUrl())}>
				<Mentions
					placeholder="Write a comment... @username for mentions"
					disabled={!isLoggedIn}
					onKeyDown={onKeyPress}
					value={txt}
					onChange={(e, newValue) => onTxtChange(newValue)}
					rows={1}
				/>
			</div>
			<div className="btn">
				<span className="material-icons-outlined" onClick={submit}>
					send
				</span>
			</div>
		</div>
	);
}
