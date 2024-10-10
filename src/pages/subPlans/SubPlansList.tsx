import React, { useEffect } from 'react';
import httpClient from 'src/utils/httpClient';
import { SubPlanDto } from 'src/types/DTOs';
import DelayedButton from 'src/components/DelayedButton';
import { SimpleSnackbarVariant, useFormValue } from '@atas/weblib-ui-js';
import H1BackBtn from 'src/components/H1BackBtn';
import { Currency } from 'src/types/enums';
import Select, { SingleValue } from 'react-select';
import popupActions from 'src/redux/actions/popupActions';
import { setPageTitle } from 'src/utils/windowUtils';
import TopLogo from 'src/appshell/TopLogo';

const SubPlansList: React.FC = () => {
	const name = useFormValue('');
	const desc = useFormValue('');
	const currency = useFormValue<Currency>(Currency.EUR, v => v);
	const price = useFormValue('');

	useEffect(() => {
		setPageTitle('Subscription Plan');

		(async () => {
			const response = await httpClient.get<SubPlanDto[]>('/api/sub-plans');
			const p = response.data.length > 0 ? response.data[0] : null;

			if (p) {
				name.onChange({ target: { value: p.name } });
				desc.onChange({ target: { value: p.description } });
				currency.onChange(p.cPrice.currency);
				price.onChange({ target: { value: p.cPrice.price?.toString() || '' } });
			}
		})();
	}, []);

	const submitPlan = async () => {
		await httpClient.post('/api/sub-plans', {
			name: name.value,
			description: desc.value,
			price: parseFloat(price.value),
			currency: currency.value,
		});

		popupActions.snackbarMsg('Subscription plan saved', SimpleSnackbarVariant.success);
	};

	const currencyOptions = Object.values(Currency).map(cur => ({
		value: cur,
		label: cur,
	}));

	return (
		<>
			<TopLogo />
			<h1>
				<H1BackBtn fallbackUrl="/my" />
				Subscription Plan
			</h1>
			<div className="box">
				<p>This is a subscription plan which you can add to your posts.</p>
				<p>
					<label className="matter-textfield-filled block">
						<input type="text" placeholder=" " {...name} />
						<span>Plan name...</span>
					</label>
					<span className="helperText">e.g. Supporter</span>
				</p>
				<p>
					<label className="matter-textfield-filled block">
						<input type="text" placeholder=" " {...desc} />
						<span>Description...</span>
					</label>
					<span className="helperText">Please explain what users will be able to see</span>
				</p>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Select
						value={{ value: currency.value, label: currency.value }}
						onChange={(option: SingleValue) => option && currency.onChange(option.value)}
						options={currencyOptions}
						placeholder="Currency"
						isSearchable={false}
						className="react-select-container"
						classNamePrefix="react-select"
					/>
					<div style={{ flex: 1, paddingLeft: 10 }}>
						<label className="matter-textfield-filled block">
							<input type="text" placeholder=" " {...price} />
							<span>Price...</span>
						</label>
					</div>
				</div>
				<br />
				<DelayedButton onDelayedClick={async () => submitPlan()} className="main block">
					Save Plan
				</DelayedButton>

				<br />
				<br />

				<strong>In the future we will be bringing tiered (multiple) plan options.</strong>
			</div>
		</>
	);
};

export default SubPlansList;
