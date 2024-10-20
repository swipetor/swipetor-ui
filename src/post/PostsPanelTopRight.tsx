import React from 'react';
import DelayedButton from 'src/components/DelayedButton';
import popupActions from 'src/redux/actions/popupActions';
import HubList from 'src/components/hubs/HubList';
import { useUIStore } from 'src/redux/reduxUtils';

function showHubsPopup() {
	popupActions.slidingPopup({
		isOpen: true,
		title: 'Hubs',
		children: () => <HubList />,
	});
}

interface Props {
	hubId?: number;
}
export default function PostsPanelTopRight(props: Props) {
	const hub = useUIStore(s => (props.hubId ? s.hub.hubsById[props.hubId] : null));

	return (
		<div className="topRight" data-infinitescroll="scroll">
			<DelayedButton onDelayedClick={() => showHubsPopup()} className="btn">
				# {hub?.name || 'All Hubs'}
			</DelayedButton>
		</div>
	);
}
