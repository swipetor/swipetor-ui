import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import httpClient from 'src/utils/httpClient';
import { LocationType } from 'src/types/enums';
import { ActionMeta, MultiValue, SingleValue, StylesConfig } from 'react-select';
import { LocationDto } from 'src/types/DTOs';
import popupActions from 'src/redux/actions/popupActions';
import { SimpleSnackbarVariant } from '@atas/weblib-ui-js';

interface LocationSelectProps {
	placeholder: string;
	type?: LocationType;
	onSelect: (locationIds: number[]) => void;
	defaultValues?: LocationSelectElem[];
	isMulti?: boolean;
	className?: string;
	limit?: number; // Add this line
}

type LocationSelectElem = { value: number; label: string };

const LocationSelect: React.FC<LocationSelectProps> = ({
	placeholder,
	type,
	onSelect,
	defaultValues,
	isMulti,
	className,
	limit,
}) => {
	const [selectedValues, setSelectedValues] = useState<LocationSelectElem[]>(defaultValues || []);

	useEffect(() => {
		if (defaultValues) {
			setSelectedValues(defaultValues);
		}
	}, [defaultValues]);

	const loadOptions = async (inputValue: string): Promise<LocationSelectElem[]> => {
		if (!inputValue || inputValue.length < 3) {
			return [];
		}

		const result = await httpClient.get<LocationDto[]>(`/api/locations/search?q=${inputValue}&type=${type || ''}`);

		return result ? result.data.map(r => ({ value: r.id, label: r.fullName, data: result.data })) : [];
	};

	const onChange = (
		value: SingleValue<LocationSelectElem> | MultiValue<LocationSelectElem>,
		action: ActionMeta<LocationSelectElem>,
	) => {
		const updatedValues: LocationSelectElem[] = value ? (Array.isArray(value) ? value : [value]) : [];

		if (isMulti && limit && updatedValues.length > limit) {
			popupActions.snackbarMsg(`You can only add ${limit} options.`, SimpleSnackbarVariant.info);
			return; // Prevent adding more options than the limit
		}

		setSelectedValues(updatedValues);
		onSelect(updatedValues.map(p => p.value));
	};

	return (
		<AsyncSelect
			placeholder={placeholder}
			loadOptions={loadOptions}
			value={selectedValues}
			noOptionsMessage={() => null}
			escapeClearsValue
			isClearable
			onChange={onChange}
			isMulti={!!isMulti}
			className={`${className || ''} reactSelectStyle`}
			styles={darkModeStyles}
		/>
	);
};

export default LocationSelect;

// Define the styles
const darkModeStyles: StylesConfig<LocationSelectElem> = {
	control: styles => ({
		...styles,
		backgroundColor: 'black',
		borderColor: 'grey',
		color: 'white',
		'&:hover': {
			borderColor: 'white',
		},
	}),
	menu: styles => ({
		...styles,
		backgroundColor: 'black',
		color: 'white',
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		backgroundColor: isFocused ? 'grey' : isSelected ? 'darkgrey' : 'black',
		color: isFocused ? 'black' : isSelected ? 'white' : 'white',
		':active': {
			backgroundColor: isSelected ? 'darkgrey' : 'grey',
		},
	}),
	singleValue: styles => ({
		...styles,
		color: 'white',
	}),
	multiValue: styles => ({
		...styles,
		backgroundColor: 'grey',
	}),
	multiValueLabel: styles => ({
		...styles,
		color: 'black',
	}),
	multiValueRemove: styles => ({
		...styles,
		color: 'black',
		':hover': {
			backgroundColor: 'white',
			color: 'black',
		},
	}),
};
