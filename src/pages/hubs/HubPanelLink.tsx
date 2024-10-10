import React from 'react';
import DelayedLink from 'src/components/DelayedLink';
import UploadedPhoto from 'src/components/UploadedPhoto';
import { detectBrowser, prettyNumberCount } from '@atas/webapp-ui-shared';
import { HubDto } from 'src/types/DTOs';

interface Props {
	hub: HubDto | null;
	selectedHubId?: number;
}

export default function HubPanelLink({ hub, selectedHubId }: Props) {
	const getHubStyleClass = () => {
		const cls = ['hubBtn'];
		if (hub?.id === selectedHubId) cls.push('selected');
		if (hub?.postCount === 0) cls.push('disabled');
		// !isRead(label) && cls.push('unread');
		return cls.join(' ');
	};

	return (
		<React.Fragment key={hub?.id || 0}>
			<DelayedLink
				to={hub?.postCount === 0 ? '#' : `/?hubId=${hub?.id}`}
				className={getHubStyleClass()}
				onInstantMobileClick={() => (detectBrowser.isMobile() ? null : null)}>
				<div className="iconCol">
					{!!hub?.photo && <UploadedPhoto size={64} photo={hub?.photo} />}
					{!hub?.photo && <span className="material-icons">tag</span>}
				</div>
				<div className="textCol">
					<div className="name">
						{hub === null && 'All Hubs'}
						{hub && (
							<>
								{hub.name} <sup>({prettyNumberCount(hub.postCount)})</sup>
							</>
						)}
					</div>
				</div>
			</DelayedLink>
		</React.Fragment>
	);
}
