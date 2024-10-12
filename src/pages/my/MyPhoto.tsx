import { PhotoUploadContext, PhotoUploadSelect } from '@atas/weblib-ui-js';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PhotoUploadPreviews from 'src/components/PhotoUploadPreviews';
import UploadedPhoto from 'src/components/UploadedPhoto';
import myActions from 'src/redux/actions/myActions';
import { UIState } from 'src/redux/reducers/reducers';
import httpClient from 'src/utils/httpClient';

export default function MyPhoto() {
	const user = useSelector((state: UIState) => state.my.user);
	const photoUploadContext = useMemo(() => new PhotoUploadContext(), []);
	const [filesCnt, setFilesCnt] = useState(0);

	useEffect(() => {
		photoUploadContext.attach(() => {
			setFilesCnt(photoUploadContext.files.length);
		});
	}, [photoUploadContext]);

	const refreshCurrentPhoto = () => {
		myActions.getMy();
	};

	const uploadClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault();
		const formdata = new FormData();
		photoUploadContext.files.map(f => formdata.set('file', f));
		await httpClient.post('/api/my/photos', formdata, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		photoUploadContext.clear();
		myActions.getMy();
	};

	const deleteClick = async (e: React.MouseEvent, photoId: string) => {
		e.preventDefault();
		await httpClient.delete(`/api/my/photos/${photoId}`);
		refreshCurrentPhoto();
		myActions.getMy();
	};

	return (
		<div className="box">
			<div className="title">My Photo</div>

			<UploadedPhoto size={64} photo={user?.photo} style={{ float: 'right' }} />

			<PhotoUploadSelect name="Change Photo" context={photoUploadContext} />

			<PhotoUploadPreviews context={photoUploadContext} />

			{photoUploadContext.files.length > 0 && (
				<button onClick={uploadClick} className="main grey block">
					Upload
				</button>
			)}
		</div>
	);
}
