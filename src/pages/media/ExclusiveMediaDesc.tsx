import DelayedButton from 'src/components/DelayedButton';
import React, { useEffect, useRef, useState } from 'react';
import { PostMediaDto } from 'src/types/DTOs';
import { useUIStore } from 'src/redux/reduxUtils';

interface Props {
	media: PostMediaDto;
}

export default function ExclusiveMediaDesc({ media }: Props) {
	const [isDescExpanded, setIsDescExpanded] = useState(false);
	const [needsExpandButton, setNeedsExpandButton] = useState(false);
	const descRef = useRef<HTMLDivElement>(null);
	const activePix = useUIStore(s => s.post.pix);
	const activeMix = useUIStore(s => s.post.mix);

	useEffect(() => {
		if (descRef.current) {
			setNeedsExpandButton(descRef.current.scrollHeight > descRef.current.clientHeight);
		}
	}, [media.description, descRef.current, activePix, activeMix]);

	const desc = media.description;

	if (!desc || desc.length === 0 || desc === '') {
		return null;
	}

	return (
		<div className="exclusiveDescWrapper">
			<div ref={descRef} className={`exclusiveDescDiv ${isDescExpanded ? 'expanded' : ''}`}>
				<span className="material-icons quoteIcon">format_quote</span>
				{desc}
				{isDescExpanded && (
					<DelayedButton onDelayedClick={() => setIsDescExpanded(!isDescExpanded)} className="lessBtn">
						<span className="material-icons">cancel</span>
					</DelayedButton>
				)}
				<span className="material-icons quoteIcon">format_quote</span>
			</div>
			{needsExpandButton && !isDescExpanded && (
				<DelayedButton onDelayedClick={() => setIsDescExpanded(!isDescExpanded)} className="moreBtn">
					{isDescExpanded ? 'Less' : 'More...'}
				</DelayedButton>
			)}
		</div>
	);
}
