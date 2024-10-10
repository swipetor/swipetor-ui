import React, { useState } from 'react';
import httpClient from 'src/utils/httpClient';
import popupActions from 'src/redux/actions/popupActions';
import { SimpleSnackbarVariant } from '@atas/weblib-ui-js';
import DelayedButton from 'src/components/DelayedButton';
import uiConfig from 'src/init/uiConfig';
import { useUIStore } from 'src/redux/reduxUtils';
import DelayedLink from 'src/components/DelayedLink';

export default function MyProfileDesc() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const user = useUIStore(s => s.my.user);
	const [description, setDescription] = useState(user?.description || '');

	const submitProfileDescription = async () => {
		try {
			setIsSubmitting(true);
			await httpClient.put('/api/my/profile', { description });
			popupActions.snackbarMsg('Profile description updated.', SimpleSnackbarVariant.success);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className="box">
				<p>
					<label className="matter-textfield-filled block">
						<input
							type="text"
							placeholder=" "
							value={description}
							maxLength={200}
							onChange={e => setDescription(e.target.value)}
						/>
						<span>Profile description...</span>
					</label>

					<span className="helperText">
						This shows up on search engines. If empty, the below will be used:
						<br />
						<i>{uiConfig.site.userProfileDesc}</i>
					</span>
				</p>

				<p className="block">
					<DelayedButton
						type="submit"
						disabled={isSubmitting}
						onDelayedClick={async () => submitProfileDescription()}
						className="main red block">
						{isSubmitting ? 'Working...' : 'Save Profile Description'}
					</DelayedButton>
				</p>
			</div>

			<div className="box">
				<h2>Custom Domain</h2>
				<DelayedLink to="/my/custom-domain" className="mainBtn red block">
					Go to Custom Domain Settings
				</DelayedLink>
			</div>
		</>
	);
}
