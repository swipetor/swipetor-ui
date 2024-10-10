import React from 'react';
import UploadedPhoto from 'src/components/UploadedPhoto';
import { PostMediaDto } from 'src/types/DTOs';

export default function PostBuilderPhoto({ media }: { media: PostMediaDto }) {
	return (
		<p style={{ textAlign: 'center' }}>
			<UploadedPhoto size={256} photo={media.photo} />
		</p>
	);
}
