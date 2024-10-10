import React from 'react';
import LocationSelect from 'src/components/LocationSelect';
import { LocationType } from 'src/types/enums';
import httpClient from 'src/utils/httpClient';
import myActions from 'src/redux/actions/myActions';
import { useUIStore } from 'src/redux/reduxUtils';
import { GeoCoordinates } from '@atas/weblib-ui-js/dist/types/utils/geolocationUtils';

export default function MyLocation() {
	const [geolocation, setGeolocation] = React.useState<GeoCoordinates | null>(null);
	const user = useUIStore(state => state.my.user);

	const saveLocation = async (locationIds: number[]) => {
		await httpClient.post('/api/my/location', { locationIds });
		myActions.getMy();
	};

	const defaultValues = (user?.locations || []).map(l => ({ value: l.id, label: l.fullName }));

	return (
		<div className="box centeredPage myPhotosDiv">
			<div className="title">My Cities</div>

			<p className="helperText">You can select up to 3 cities.</p>

			<LocationSelect
				placeholder={'Type city'}
				type={LocationType.City}
				isMulti
				onSelect={saveLocation}
				defaultValues={defaultValues}
				limit={3}
			/>

			{geolocation && (
				<div>
					{geolocation.latitude}, {geolocation.longitude}
				</div>
			)}
		</div>
	);
}
