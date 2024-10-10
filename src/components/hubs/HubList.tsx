import { intOrDefault } from '@atas/weblib-ui-js';
import querystring from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';
import HubPanelLink from 'src/pages/hubs/HubPanelLink';
import { useUIStore } from 'src/redux/reduxUtils';

export default function HubList() {
	const location = useLocation();

	const hubsById = useUIStore(s => s.hub.hubsById);
	const hubs = Object.values(hubsById || {});

	const qs = querystring.parse(location.search);
	const selectedHubId = qs['hubId'] ? intOrDefault(qs['hubId'] as string, 0) : undefined;

	return (
		<div className="hubList">
			<HubPanelLink hub={null} selectedHubId={selectedHubId} />
			{hubs.map((h, i) => (
				<HubPanelLink key={i} hub={h} selectedHubId={selectedHubId} />
			))}
		</div>
	);
}
