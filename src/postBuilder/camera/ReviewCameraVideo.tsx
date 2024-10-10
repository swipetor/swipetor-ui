import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';
import DelayedLink from 'src/components/DelayedLink';
import popupActions from 'src/redux/actions/popupActions';
import CreateDraftPostPopup from 'src/postBuilder/popups/CreateDraftPostPopup';
import httpClient from 'src/utils/httpClient';
import { HttpClientFileUploadHeaders } from '@atas/weblib-ui-js';
import { useUIStore } from 'src/redux/reduxUtils';
import { UserRole } from 'src/types/enums';

export default function ReviewCameraVideo() {
	const location = useLocation();
	const navigate = useNavigate();
	const user = useUIStore(s => s.my.user);
	const isLoggedIn = useUIStore(s => s.my.isLoggedIn);
	const videoBlob = location.state?.video as Blob | undefined | null;

	// Use useEffect to handle redirection, which keeps this logic out of the render phase
	useEffect(() => {
		if (!videoBlob) {
			navigate('/camera');
		}
	}, [navigate, videoBlob]);

	if (!videoBlob) return null;

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
					formdata.set('file', videoBlob);

					await httpClient.post(`/api/medias/videos?postId=${pid}&isInstant=true`, formdata, {
						headers: HttpClientFileUploadHeaders,
					});
				}}
			/>
		));
	};

	return (
		<div className="cameraReviewPage">
			<div className="content">
				<video src={URL.createObjectURL(videoBlob)} autoPlay playsInline loop className="cameraPhotoImg" />
			</div>

			<div className="actionButtons">
				<DelayedLink className="mainBtn white block" to="/camera">
					<span className="material-icons">camera_alt</span>&nbsp; Back to Camera
				</DelayedLink>

				<DelayedButton className="main block" onDelayedClick={() => createPost()}>
					<span className="material-icons">add_circle</span>&nbsp; Create Post
				</DelayedButton>
			</div>
		</div>
	);
}
