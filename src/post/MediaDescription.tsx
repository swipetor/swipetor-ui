import React, { useEffect, useRef, useState } from 'react';
import DelayedButton from 'src/components/DelayedButton';
import { PostForUser, PostMediaDto } from 'src/types/DTOs';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

interface Props {
	post: PostWithIndex<PostForUser>;
	media: PostMediaDto;
}

const MediaDescription: React.FC<Props> = ({ post, media }) => {
	const textDivRef = useRef<HTMLDivElement>(null);
	const [collapsed, setCollapsed] = useState(true);
	const [isEllipsisActive, setIsEllipsisActive] = useState(false);

	useEffect(() => {
		const textDiv = textDivRef.current;
		if (textDiv) {
			setIsEllipsisActive(textDiv.offsetWidth < textDiv.scrollWidth);
		}
	}, []);

	let textDesc = media.description || post.title;
	if (media.video?.captions) {
		textDesc += ' Captions: ' + media.video.captions;
	}
	if (media.article) {
		textDesc += ' Contents: ' + media.article;
	}

	if (!textDesc || textDesc.trim() === '') return null;

	const showFullDescription = (
		<div>
			<b>{media.description || post.title}</b>
			{media.video?.captions && (
				<p>
					<b>Captions:</b> {media.video?.captions}
				</p>
			)}
			{media.article && (
				<p>
					<b>Contents:</b>
					<span dangerouslySetInnerHTML={{ __html: media.article.replace(/\n/g, '<br />') }} />
				</p>
			)}
		</div>
	);

	return (
		<div className={`mediaDescription ${collapsed ? 'collapsed' : ''}`}>
			<div ref={textDivRef} className="mediaDescText">
				{collapsed && !window.userDeviceInfo?.isBot && textDesc}
				{(window.userDeviceInfo?.isBot || !collapsed) && (
					<>
						{showFullDescription}
						<DelayedButton
							data-infinitescroll="scroll"
							onDelayedClick={() => setCollapsed(true)}
							className="less">
							Less
						</DelayedButton>
					</>
				)}
			</div>

			{collapsed && isEllipsisActive && (
				<DelayedButton data-infinitescroll="scroll" onDelayedClick={() => setCollapsed(false)} className="more">
					More
				</DelayedButton>
			)}
		</div>
	);
};

export default MediaDescription;
