import { prettySeconds } from '@atas/weblib-ui-js';
import PubSub from 'pubsub-js';
import React, { CSSProperties } from 'react';
import DelayedButton from 'src/components/DelayedButton';
import uiConfig from 'src/init/uiConfig';
import storageBucket from 'src/libs/storageBucket';
import popupActions from 'src/redux/actions/popupActions';
import { PostMediaDto } from 'src/types/DTOs';

interface Props {
	media?: PostMediaDto;
}

function HorizontalVideoSprite({ media }: Props) {
	const onThumbnailClick = (seconds: number) => {
		PubSub.publish('video.settime', seconds);
		popupActions.slidingPopup({ isOpen: false });
	};

	const generateThumbnails = () => {
		const sprites = media?.video?.sprites;
		const sprite = sprites ? sprites[0] : undefined;

		if (!sprite || !media) return null;

		const thumbs: { bgPosition: number; time: number; displayTime: number }[] = [];
		const interval = sprite.interval;
		const startTime = 0;
		const endTime = undefined;

		for (let i = 0; i < sprite.thumbnailCount; i++) {
			const thumbTime = sprite.interval * i;
			if (thumbTime < startTime || (endTime && thumbTime > endTime)) continue;

			thumbs.push({
				bgPosition: i * sprite.thumbnailWidth,
				time: thumbTime,
				displayTime: thumbTime - startTime,
			});
		}

		return thumbs;
	};

	const getSpriteThumbnail = () => {
		const sprites = media?.video?.sprites;
		const sprite = sprites ? sprites[0] : undefined;

		if (!sprite) return null;

		const spriteStyle: CSSProperties = {
			width: sprite.thumbnailWidth,
			height: sprite.thumbnailHeight,
			backgroundImage: `url(https://${uiConfig.storage.mediaHost}/${storageBucket.sprites}/${sprite.id}.webp)`,
		};

		return generateThumbnails()?.map((t, i) => (
			<DelayedButton
				key={i}
				style={{ ...spriteStyle, backgroundPosition: `-${t.bgPosition}px 0px` }}
				onDelayedClick={() => onThumbnailClick(Math.floor(t.time))}
				className="thumbnail">
				<div className="time">{prettySeconds(t.displayTime)}</div>
			</DelayedButton>
		));
	};

	return <div className="spriteWrapper">{getSpriteThumbnail()}</div>;
}

export default HorizontalVideoSprite;
