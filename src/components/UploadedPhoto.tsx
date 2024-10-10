import React from 'react';
import uiConfig from 'src/init/uiConfig';
import storageBucket from 'src/libs/storageBucket';
import { PhotoDto } from 'src/types/DTOs';

// Define the Props interface that extends the ImgHTMLAttributes<HTMLImageElement> interface
interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
	photo?: PhotoDto | null;
	isUserPhoto?: boolean;
	size?: 64 | 128 | 256 | 512;
}

// Define a function to get the default photo URL based on whether it's a user photo and the size requested
const getDefaultPhoto = (isUserPhoto?: boolean, size?: number) => {
	// Determine the default size based on the input size
	const defaultPhotoSize = size && size > 300 ? 600 : 300;
	// Return the default photo URL based on whether it's a user photo or not
	return isUserPhoto ? `/public/images/person.svg` : `/public/images/nophoto/nophoto-${defaultPhotoSize}.png`;
};

// Define the UploadedPhoto component
export default function UploadedPhoto({ photo, isUserPhoto, size, ...rest }: Props) {
	// Define a function to get the photo source URL based on the input parameters
	const getPhotoSrc = () => {
		// If there's no photo or no photo ID, return the default photo URL
		if (!photo || !photo.id) return getDefaultPhoto(isUserPhoto, size);

		// If the size is not specified, return the full-size photo URL
		if (size === undefined) {
			return `https://${uiConfig.storage.mediaHost}/${storageBucket.photos}/${photo.id}.${photo.ext}`;
		}
		// If the requested size is available, return the photo URL with the size appended
		else if (photo.sizes.includes(size)) {
			return `https://${uiConfig.storage.mediaHost}/${storageBucket.photos}/${photo.id}-${size}.${photo.ext}`;
		}
		// If the requested size is not available, return the URL to fetch the photo with the requested size
		else {
			return `/api/photos/${photo.id}/sizes/${size}`;
		}
	};

	// Set the style of the image based on the size
	const style = {
		...(rest.style || {}),
		maxWidth: size,
		maxHeight: size,
	};
	delete rest.style;

	// Get the photo source URL
	const src = getPhotoSrc();

	// Render the image component with the photo source URL and style
	return src ? <img src={src} {...rest} style={style} /> : null;
}
