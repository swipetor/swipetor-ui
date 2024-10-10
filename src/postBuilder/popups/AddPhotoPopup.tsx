import {
	HttpClientFileUploadHeaders,
	PhotoUploadContext,
	PhotoUploadSelect,
	SimpleSnackbarVariant,
} from '@atas/webapp-ui-shared';
import React, { useRef, useState } from 'react';
import PhotoUploadPreviews from 'src/components/PhotoUploadPreviews';
import PopupWrapper from 'src/popups/PopupWrapper';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';

interface Props {
	postId: number;
	refresh: () => void;
}

const AddPhotoPopup = ({ postId, refresh }: Props) => {
	const [photoUrl, setPhotoUrl] = useState('');
	const [photoUploadContext, setPhotoUploadContext] = useState(new PhotoUploadContext());
	const [okayBtnDisabled, setOkayBtnDisabled] = useState(false);
	const inputRef = useRef(null);

	const okayBtnClick = async () => {
		const formdata = new FormData();

		const files = photoUploadContext.files;
		if (files && files[0]) formdata.set('file', files[0]);

		formdata.set('photoUrl', photoUrl);

		setOkayBtnDisabled(true);

		try {
			await httpClient.post(`/api/medias/photos?postId=${postId}`, formdata, {
				headers: HttpClientFileUploadHeaders,
			});

			popupActions.snackbarMsg('Photo is added', SimpleSnackbarVariant.success);
			photoUploadContext.clear();
			setPhotoUrl('');
			setOkayBtnDisabled(false);
			popupActions.hideGlobalPopupComponent();
			refresh();
		} catch (error) {
			console.error('Error adding photo:', error);
			setOkayBtnDisabled(false);
		}
	};

	return (
		<PopupWrapper title="Add Photo" okayBtnClick={okayBtnClick} okayBtnDisabled={okayBtnDisabled}>
			<div style={{ minWidth: 300 }}>
				<PhotoUploadSelect name="Select Photo" context={photoUploadContext} />
				<PhotoUploadPreviews context={photoUploadContext} />

				<div className="horizontalLine">
					<span>OR</span>
				</div>

				<label className="matter-textfield-filled block">
					<input
						value={photoUrl}
						placeholder=" "
						ref={inputRef}
						onChange={e => setPhotoUrl(e.target.value)}
					/>
					<span>https://</span>
				</label>
				<span className="helperText">You can manage this after it's added to the post builder.</span>
			</div>
		</PopupWrapper>
	);
};

export default AddPhotoPopup;
