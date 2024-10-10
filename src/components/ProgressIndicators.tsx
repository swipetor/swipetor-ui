import React from 'react';

interface Props {
	total: number;
	active: number;
}

export default function ProgressIndicators({ total, active }: Props) {
	if (total === 1) return null;

	const getCls = (index: number) => {
		const cls = [];
		if (index === active) cls.push('selected');
		return cls.join(' ');
	};

	return (
		<div className="postMediaBullets">
			{Array.from({ length: total }).map((_, i) => (
				<div key={i} data-media-index={i} className={getCls(i)}></div>
			))}
		</div>
	);
}
