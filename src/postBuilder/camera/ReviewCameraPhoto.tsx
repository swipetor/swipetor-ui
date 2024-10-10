import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';
import DelayedLink from 'src/components/DelayedLink';
import popupActions from 'src/redux/actions/popupActions';
import CreateDraftPostPopup from 'src/postBuilder/popups/CreateDraftPostPopup';
import httpClient from 'src/utils/httpClient';
import { HttpClientFileUploadHeaders } from '@atas/weblib-ui-js';
import { UserRole } from 'src/types/enums';
import { useUIStore } from 'src/redux/reduxUtils';

export default function ReviewCameraPhoto() {
	const location = useLocation();
	const navigate = useNavigate();
	const user = useUIStore(s => s.my.user);
	const isLoggedIn = useUIStore(s => s.my.isLoggedIn);
	const photoBlob = location.state?.photo as Blob | undefined | null;

	// Use useEffect to handle redirection, which keeps this logic out of the render phase
	useEffect(() => {
		if (!photoBlob) {
			navigate('/camera');
		}
	}, [navigate, photoBlob]);

	if (!photoBlob) return null;

	const createPost = () => {
		if (isLoggedIn === false) {
			return navigate('/login');
		}
		if (!user || user.role < UserRole.Creator) {
			return navigate('/become-creator');
		}

		popupActions.showGlobalPopupComponent(() => (
			<CreateDraftPostPopup
				onPostCreated={async pid => {
					const formdata = new FormData();
					formdata.set('file', photoBlob);

					await httpClient.post(`/api/medias/photos?postId=${pid}&isInstant=true`, formdata, {
						headers: HttpClientFileUploadHeaders,
					});
				}}
			/>
		));
	};

	return (
		<div className="cameraReviewPage">
			<div className="content">
				<img src={URL.createObjectURL(photoBlob)} alt="Camera photo" className="cameraPhotoImg" />
			</div>

			<div className="actionButtons">
				<DelayedLink className="mainBtn white block" to="/camera">
					<span className="material-icons">camera_alt</span>&nbsp; Back to Camera
				</DelayedLink>

				<DelayedButton className="main block" loggedInOnly onDelayedClick={() => createPost()}>
					<span className="material-icons">add_circle</span>&nbsp; Create Post
				</DelayedButton>
			</div>
		</div>
	);
}
