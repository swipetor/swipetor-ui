import DelayedButton from 'src/components/DelayedButton';
import popupActions from 'src/redux/actions/popupActions';
import CreateDraftPostPopup from 'src/postBuilder/popups/CreateDraftPostPopup';
import React from 'react';
import { useUIStore } from 'src/redux/reduxUtils';
import { UserRole } from 'src/types/enums';
import { useNavigate } from 'react-router-dom';

export default function PostBuilderHomePopup() {
	const user = useUIStore(s => s.my.user);
	const isLoggedIn = useUIStore(s => s.my.isLoggedIn);
	const navigate = useNavigate();

	const isCreator = isLoggedIn === true && user!.role >= UserRole.Creator;

	return (
		<div className="postBuilderHomePopup">
			<DelayedButton
				className="mainBtn block"
				onDelayedClick={() => {
					popupActions.fullScreenPopup({ isOpen: false });
					navigate('/camera');
				}}>
				<span className="material-icons">add_a_photo</span>
				&nbsp; Snap Instant Post
			</DelayedButton>

			<br />

			<DelayedButton
				className="main block"
				loggedInOnly
				onDelayedClick={() => {
					popupActions.fullScreenPopup({ isOpen: false });
					if (isCreator) {
						setTimeout(() => popupActions.showGlobalPopupComponent(() => <CreateDraftPostPopup />), 400);
					} else {
						navigate('/become-creator');
					}
				}}>
				<span className="material-icons">add</span>
				&nbsp; Create Manual Post
			</DelayedButton>

			<br />

			<DelayedButton
				className="mainBtn grey block"
				onDelayedClick={() => {
					popupActions.fullScreenPopup({ isOpen: false });
					navigate('/post-builder');
				}}>
				<span className="material-icons">list</span>
				&nbsp; Post List
			</DelayedButton>
		</div>
	);
}
