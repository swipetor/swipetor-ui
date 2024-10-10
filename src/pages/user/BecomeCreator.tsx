import React, { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import httpClient from 'src/utils/httpClient';
import DelayedButton from 'src/components/DelayedButton';
import DelayedLink from 'src/components/DelayedLink';
import { useUIStore } from 'src/redux/reduxUtils';
import { getLoginUrlWithRedir, SimpleSnackbarVariant, useFormValue } from '@atas/weblib-ui-js';
import { UserRole } from 'src/types/enums';
import popupActions from 'src/redux/actions/popupActions';
import uiConfig from 'src/init/uiConfig';
import ReCAPTCHA from 'react-google-recaptcha';
import TopLogo from 'src/appshell/TopLogo';

const BecomeCreator: React.FC = () => {
	const isLoggedIn = useUIStore(s => s.my.isLoggedIn);
	const user = useUIStore(s => s.my.user);
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const recaptcha = useFormValue(null, v => v);
	const [txt, setTxt] = useState<string>('');
	const [submitted, setSubmitted] = useState<boolean>(false);
	const navigate = useNavigate();

	if (isLoggedIn === false) {
		return <Navigate to={getLoginUrlWithRedir()} />;
	}

	if (user && user?.role >= UserRole.Creator) {
		return <Navigate to="/" />;
	}

	const handleSubmit = async () => {
		if (txt.length < 50) {
			return popupActions.snackbarMsg('Please provide more information', SimpleSnackbarVariant.error);
		}

		const recaptchaValue = await recaptchaRef.current?.executeAsync();

		try {
			await httpClient.post('/api/users/become-creator', { txt, recaptchaValue });
			setSubmitted(true);
		} catch (error) {
			console.error('Error submitting form', error);
		} finally {
			recaptchaRef.current?.reset();
		}
	};

	if (submitted) {
		return (
			<div className="box" style={{ marginTop: 10 }}>
				<p>That's it, we'll check that, likely today.</p>
				<p>You might get an email back</p>
				<p>Thank you for your interest.</p>
				<DelayedLink to="/" className="mainBtn block">
					Go to Home
				</DelayedLink>
			</div>
		);
	}

	return (
		<>
			<TopLogo />
			<h1>Become a Creator</h1>

			<div className="becomeCreator box">
				<form onSubmit={handleSubmit}>
					<br />
					<div>
						Please fill in the form with your
						<ul>
							<li>Social media URLs</li>
							<li>Website URLs</li>
							<li>How you like to utilise our platform</li>
						</ul>
					</div>

					<label className="matter-textfield-filled block">
						<textarea value={txt} placeholder=" " onChange={e => setTxt(e.target.value)} />
						<span>Social media and website URLs, goals...</span>
					</label>
					<br />

					<div style={{ display: 'flex' }}>
						<DelayedButton type="submit" onDelayedClick={() => navigate('/')} className="main grey block">
							Cancel
						</DelayedButton>
						&nbsp;
						<DelayedButton type="submit" onDelayedClick={async () => handleSubmit()} className="main block">
							Submit
						</DelayedButton>
					</div>
					<br />
					<br />
					<ReCAPTCHA
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
						ref={recaptchaRef}
						sitekey={uiConfig.recaptcha?.key || ''}
						theme="dark"
						size={'invisible'}
						badge={'inline'}
						onChange={recaptcha.onChange}
					/>
				</form>
			</div>
		</>
	);
};

export default BecomeCreator;
