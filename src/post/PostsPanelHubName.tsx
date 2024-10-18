import { shortenString } from '@atas/weblib-ui-js';
import React, { useEffect, useState } from 'react';
import { HubDto, UserDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';

interface Props {
	hub: HubDto;
	userId?: number;
}

export default function PostsPanelHubName({ hub, userId }: Props) {
	const [hubName, setHubName] = useState('');

	useEffect(() => {
		load();
	}, [hub, userId]);

	async function load() {
		if (userId) {
			const resp = await httpClient.get<{ user: UserDto }>(`/api/users/${userId}`);
			setHubName(`@${shortenString(resp.data.user.username, 24)}`);
		} else {
			setHubName(`#${shortenString(hub?.name, 24)}`);
		}
	}

	return <>{hubName}</>;
}
