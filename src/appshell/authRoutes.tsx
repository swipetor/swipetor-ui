import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUIStore } from 'src/redux/reduxUtils';
import { UserRole } from 'src/types/enums';
import { getLoginUrlWithRedir } from '@atas/webapp-ui-shared';
import popupActions from 'src/redux/actions/popupActions';

interface Props {
	elem: React.ReactNode;
}

export function CreatorOnly(props: Props) {
	const isLoggedIn = useUIStore(state => state.my.isLoggedIn);
	const user = useUIStore(state => state.my.user);

	if (isLoggedIn === null) return null;

	if (!isLoggedIn) {
		popupActions.fullScreenPopup({ isOpen: false });
		return <Navigate to={getLoginUrlWithRedir()} />;
	}

	if (user && user.role < UserRole.Creator) {
		popupActions.fullScreenPopup({ isOpen: false });
		return <Navigate to="/become-creator" />;
	}

	return <>{props.elem}</>;
}

export function LoggedInOnly(props: Props) {
	const isLoggedIn = useUIStore(state => state.my.isLoggedIn);
	const user = useUIStore(state => state.my.user);

	if (isLoggedIn === null) return null;

	if (!isLoggedIn) {
		popupActions.fullScreenPopup({ isOpen: false });
		return <Navigate to={getLoginUrlWithRedir()} />;
	}

	return <>{props.elem}</>;
}
