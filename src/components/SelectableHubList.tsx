import { prettyNumberCount, SimpleSnackbarVariant } from '@atas/webapp-ui-shared';
import React, { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import DelayedButton from 'src/components/DelayedButton';
import UploadedPhoto from 'src/components/UploadedPhoto';
import popupActions from 'src/redux/actions/popupActions';
import { useUIStore } from 'src/redux/reduxUtils';
import { HubDto } from 'src/types/DTOs';

interface Props {
	selectedHubIds: number[];
	// Max number of hubs that can be selected
	maxSelection?: number;
	onSelectionChange(selectedHubIds: number[]): void;
}

function SelectableHubList({ selectedHubIds, maxSelection, onSelectionChange }: Props) {
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	const { hubsById } = useUIStore(
		s => ({
			hubsById: s.hub.hubsById,
		}),
		shallowEqual,
	);

	useEffect(() => {
		setSelectedIds(selectedHubIds);
	}, [selectedHubIds]);

	const getHubs = () => {
		if (!hubsById) return [];
		const otherHubs = Object.values(hubsById);
		return otherHubs.sort((f1, f2) => f2.postCount - f1.postCount).filter(c => c.id > 0);
	};

	const toggleSelect = (hubId: number) => {
		let updatedSelectedIds = [...selectedIds];

		if (updatedSelectedIds.includes(hubId)) {
			updatedSelectedIds = updatedSelectedIds.filter(cid => cid !== hubId);
		} else {
			// If maxSelection is set
			if (maxSelection && updatedSelectedIds.length >= maxSelection) {
				return popupActions.snackbarMsg(
					`Max ${maxSelection} hubs can be selected.`,
					SimpleSnackbarVariant.error,
				);
			}
			updatedSelectedIds.push(hubId);
		}

		setSelectedIds(updatedSelectedIds);
		onSelectionChange(updatedSelectedIds);
		if (maxSelection === 1) {
			popupActions.slidingPopup({ isOpen: false });
		}
	};

	if (!hubsById) return null;

	return (
		<div className="selectableHubListWrapper">
			<div className="hubList">
				{getHubs().map((c, i) => (
					<SingleHubButton
						key={c.id}
						hub={c}
						isSelected={selectedIds.includes(c.id)}
						toggle={() => toggleSelect(c.id)}
					/>
				))}
				<p className="helperText" style={{ textAlign: 'center' }}>
					If you have a new hub suggestion, please contact us from the side 🍔 menu.
				</p>
			</div>
			<div className="actionButtons">
				{maxSelection !== 1 && (
					<DelayedButton onDelayedClick={() => popupActions.slidingPopup({ isOpen: false })} className="main">
						Close
					</DelayedButton>
				)}
			</div>
		</div>
	);
}

interface SingleHubButtonProps {
	hub: HubDto;
	isSelected: boolean;
	toggle: () => void;
}

function SingleHubButton({ hub, isSelected, toggle }: SingleHubButtonProps) {
	return (
		<DelayedButton onDelayedClick={toggle} className={`main singleHubButton ${isSelected ? '' : 'grey'}`}>
			{!!hub.photo && <UploadedPhoto size={64} photo={hub.photo} />}
			{!hub.photo && <span className="material-icons">tag</span>}
			<div className="name">
				{hub.name} <sup>({prettyNumberCount(hub.postCount)})</sup>
			</div>
		</DelayedButton>
	);
}

export default SelectableHubList;
