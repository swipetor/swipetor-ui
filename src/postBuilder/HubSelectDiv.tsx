import DelayedButton from 'src/components/DelayedButton';
import React from 'react';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';
import popupActions from 'src/redux/actions/popupActions';
import SelectableHubList from 'src/components/SelectableHubList';
import { useUIStore } from 'src/redux/reduxUtils';

function showHubSelect(selectedHubIds: number[], onHubSelect: (ids: number[]) => void) {
	popupActions.slidingPopup({
		isOpen: true,
		title: 'Select Hubs',
		children: () => (
			<SelectableHubList
				selectedHubIds={selectedHubIds}
				onSelectionChange={ids => onHubSelect(ids)}
				maxSelection={3}
			/>
		),
	});
}

export function HubSelectDiv() {
	const { updateS, s } = usePostBuilderContext();
	const hubsById = useUIStore(state => state.hub.hubsById);

	function getSelectedHubNames() {
		if (!s.selectedHubIds) return '';
		return s.selectedHubIds.map(cid => hubsById[cid]?.name).join(', ');
	}

	return (
		<div className="hubSelectDiv">
			<span className="material-icons-outlined icon">tag</span>
			<div className="content">
				<DelayedButton
					onDelayedClick={() => showHubSelect(s.selectedHubIds, ids => updateS({ selectedHubIds: ids }))}
					className="main">
					Select Hubs
				</DelayedButton>
				&nbsp;&nbsp;
				{getSelectedHubNames()}
			</div>
		</div>
	);
}
