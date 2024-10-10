import DelayedButton from 'src/components/DelayedButton';
import React, { useState } from 'react';
import popupActions from 'src/redux/actions/popupActions';
import { SimpleSnackbarVariant } from '@atas/webapp-ui-shared';
import { useNavigate } from 'react-router-dom';
import httpClient from 'src/utils/httpClient';
import { GetUsersApiResp } from 'src/types/ApiResponses';

interface Props {
	user: { id: number; username: string };
	className?: string;
	canMsg?: boolean | null;
	pmThreadId?: number | null;
	showMsgText?: boolean;
}

export default function UserMsgButton(p: Props) {
	const navigate = useNavigate();
	const [userResp, setUserResp] = useState<GetUsersApiResp>();

	const initPm = async () => {
		const msgInfo = await getMsgInfo();

		if (msgInfo.pmThreadId) {
			return navigate(`/pm/${msgInfo.pmThreadId}`);
		}

		if (!msgInfo.canMsg) {
			return popupActions.snackbarMsg(
				'Only followers and recent comments can be messaged.',
				SimpleSnackbarVariant.error,
			);
		}
		navigate('/pm/new?userIds=' + p.user.id);
	};

	const getMsgInfo = async () => {
		if (p.canMsg !== null && p.canMsg !== undefined) {
			return { canMsg: p.canMsg, pmThreadId: p.pmThreadId };
		}

		if (userResp) {
			return { canMsg: userResp.canMsg, pmThreadId: userResp.pmThreadId };
		}

		const r = await httpClient.get<GetUsersApiResp>(`/api/users/${p.user.id}`);
		setUserResp(r.data);

		return { canMsg: r.data.canMsg, pmThreadId: r.data.pmThreadId };
	};

	const noMsgInfo = (p.canMsg === null || p.canMsg === undefined) && !userResp;

	return (
		<DelayedButton
			onDelayedClick={async () => initPm()}
			loggedInOnly
			className={`mainBtn ${p.className} ${noMsgInfo || userResp?.canMsg || p.canMsg ? '' : 'grey'}`}>
			<span className="material-icons">email</span>
			{p.showMsgText ? ' Msg' : ''}
		</DelayedButton>
	);
}
