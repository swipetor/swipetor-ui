import { HttpClientFileUploadHeaders, isHttpsUrl, SimpleSnackbarVariant } from '@atas/weblib-ui-js';
import React, { useState } from 'react';
import PopupWrapper from 'src/popups/PopupWrapper';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';

interface Props {
	postId: number;
	refresh: () => void;
}

async function handleVideoFromUrl(postId: number, url: string) {
	await httpClient.post(
		`/api/medias/videos/from-url`,
		{
			postId,
			url,
		},
		{
			timeout: 1000 * 60 * 60,
		},
	);
}

const handleFileUpload = async (postId: number, file: File) => {
	const formdata = new FormData();
	formdata.set('file', file);

	await httpClient.post(`/api/medias/videos?postId=${postId}`, formdata, {
		headers: HttpClientFileUploadHeaders,
		timeout: 1000 * 60 * 60,
	});

	popupActions.snackbarMsg('Video is added', SimpleSnackbarVariant.success);
};

const AddVideoPopup: React.FC<Props> = ({ postId, refresh }) => {
	const [file, setFile] = useState<File | undefined>(undefined);
	const [okayButtonDisabled, setOkayButtonDisabled] = useState<boolean>(false);
	const [mediaUrl, setMediaUrl] = useState('');

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0]);
		}
	};

	const okayBtnClick = async (): Promise<void> => {
		try {
			setOkayButtonDisabled(true);
			if (file) {
				await handleFileUpload(postId, file);
			} else if (isHttpsUrl(mediaUrl.trim())) {
				await handleVideoFromUrl(postId, mediaUrl.trim());
			} else {
				return popupActions.snackbarMsg('Please fill in one of the inputs.', SimpleSnackbarVariant.error);
			}
		} finally {
			setOkayButtonDisabled(false);
			popupActions.hideGlobalPopupComponent();
			setFile(undefined);
			setMediaUrl('');
			refresh();
		}
	};

	return (
		<PopupWrapper title="Add Video" okayBtnClick={okayBtnClick} okayBtnDisabled={okayButtonDisabled}>
			<div style={{ minWidth: 300 }}>
				<input type="file" id="video" name="avatar" accept="video/mp4" onChange={onFileChange} />
				<br />
				<br />

				<div className="horizontalLine">
					<span>OR</span>
				</div>

				<div style={{ minWidth: 300 }}>
					<label className="matter-textfield-filled block">
						<input value={mediaUrl} placeholder=" " autoFocus onChange={e => setMediaUrl(e.target.value)} />
						<span>https://...</span>
					</label>
				</div>

				<br />

				<span className="helperText">You can manage the video after it's added to the post builder.</span>
			</div>
		</PopupWrapper>
	);
};

export default AddVideoPopup;
