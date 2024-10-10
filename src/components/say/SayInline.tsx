import querystring from 'query-string';
import { useLocation } from 'react-router-dom';
import { SayMsgKey, SayMsgs } from './SayMsgs';
import popupActions from 'src/redux/actions/popupActions';
import { useEffect, useMemo } from 'react';

export default function SayInline() {
	const location = useLocation();
	const qs = useMemo(() => querystring.parse(location.search), [location.search]);

	useEffect(() => {
		if (!qs.msgCode) return;

		const msgKey = SayMsgKey[qs.msgCode as SayMsgKey];
		const msg = SayMsgs[msgKey];

		if (msg) {
			popupActions.snackbarMsg(msg.msg, msg.color as any);
		}
	}, [qs.msgCode]);

	return null;
}
