import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import httpClient from 'src/utils/httpClient';
import photoUtils from 'src/utils/photoUtils';
import { PublicUserDto, UserDto } from '../types/DTOs';
import { UserRole } from 'src/types/enums';
import { useUIStore } from 'src/redux/reduxUtils';
import { GetUsersApiResp } from 'src/types/ApiResponses';

interface Props {
	placeholder?: string;
	name?: string;
	minRole: UserRole;
	isMulti?: boolean;
	defaultValue?: { label: string; value: number; icon: string };
	defaultUserIds?: number[];
	onChange?(userIds: number[]): void;
}

const IconOption = (props: any) => (
	<components.Option {...props}>
		<div className="userSelectOption">
			<img src={props.data.icon} style={{ width: 32, height: 32 }} alt={props.data.label} />
			<span>{props.data.label}</span>
		</div>
	</components.Option>
);

const MultiValueOption = (props: any) => (
	<components.MultiValue {...props}>
		<div className="userSelectOption">
			<img src={props.data.icon} style={{ width: 32, height: 32 }} alt={props.data.label} />
			<span>{props.data.label}</span>
		</div>
	</components.MultiValue>
);

const UserSelect: React.FC<Props> = ({
	placeholder = 'Select users...',
	name,
	isMulti,
	minRole,
	defaultValue,
	defaultUserIds = [],
	onChange,
}) => {
	const currentUser = useUIStore(s => s.my.user);
	const [initialOptions, setInitialOptions] = useState<{ label: string; value: number; icon: string }[] | null>(null);

	useEffect(() => {
		if (defaultUserIds.length > 0) {
			const fetchUsers = async () => {
				const limitedUserIds = defaultUserIds.slice(0, 3);
				const users: PublicUserDto[] = [];
				for (const id of limitedUserIds) {
					const res = await httpClient.get<GetUsersApiResp>(`/api/users/${id}`);
					users.push(res.data.user);
				}
				const options = users.map(u => ({
					label: u.username,
					value: u.id,
					icon: photoUtils.getSrcByPhoto(u.photo, 64, true),
				}));
				setInitialOptions(options);
				onChange && onChange(defaultUserIds);
			};
			fetchUsers();
		}
	}, [defaultUserIds]);

	const getOptions = async (inputValue: string) => {
		const keyword = inputValue?.trim() || '';
		if (keyword.length < 3) return [];

		const params = {
			username: keyword,
			minRole,
		};

		const res = await httpClient.get<UserDto[]>('/api/users/search?' + qs.stringify(params));
		return res.data
			.filter(u => u.id !== currentUser?.id)
			.map(u => ({
				label: u.username,
				value: u.id,
				icon: photoUtils.getSrcByPhoto(u.photo, 64, true),
			}));
	};

	const handleSelectChange = (e: any) => {
		const selectedValues = Array.isArray(e) ? e.map(i => i.value) : e ? [e.value] : [];
		onChange && onChange(selectedValues);
	};

	if (defaultUserIds.length > 0 && initialOptions === null) return null;

	return (
		<AsyncSelect
			name={name}
			placeholder={placeholder}
			isMulti={!!isMulti}
			cacheOptions
			defaultOptions
			loadOptions={getOptions}
			defaultValue={defaultValue || initialOptions}
			onChange={handleSelectChange}
			components={{ Option: IconOption, MultiValue: MultiValueOption }}
			className="react-select-container"
			classNamePrefix="react-select"
			styles={{
				input: (provided, state) => ({
					...provided,
					minHeight: 38,
				}),
			}}
		/>
	);
};

export default UserSelect;
