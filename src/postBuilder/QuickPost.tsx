import { SimpleSnackbarVariant, useFormValue } from '@atas/webapp-ui-shared';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import TopLogo from 'src/appshell/TopLogo';
import DelayedButton from 'src/components/DelayedButton';
import DelayedLink from 'src/components/DelayedLink';
import uiConfig from 'src/init/uiConfig';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';

interface Props {}

export default function QuickPost(props: Props) {
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const recaptcha = useFormValue(null, v => v);
	const [url, setUrl] = useState<string>('');
	const [submitted, setSubmitted] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (url.length < 50) {
			return popupActions.snackbarMsg('Please provide more information', SimpleSnackbarVariant.error);
		}

		const recaptchaValue = await recaptchaRef.current?.executeAsync();

		try {
			await httpClient.post('/api/users/become-creator', { txt: url, recaptchaValue });
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
			<h1>Add a Quick Post</h1>

			<div className="becomeCreator box">
				<form onSubmit={handleSubmit}>
					<br />

					<p>Submit a post URL from any site:</p>

					<label className="matter-textfield-filled block">
						<input type="text" value={url} placeholder=" " onChange={e => setUrl(e.target.value)} />
						<span>Post URL...</span>
					</label>

					<br />

					<p>
						<strong>Did you know?</strong> Your own ads with links show up on the posts you submit 50% of
						the time. We show your ad for a couple of seconds before looping the video.
						<br />
						<br />
						<DelayedLink to="/my/ads" className="mainBtn gold">
							Manage My Ads
						</DelayedLink>
					</p>

					<p>
						The other 50% of ads are shown from users who invited the most users onto the system with a min
						of 20 invitees. If you invited 40 people and someone else 20, your ads will show up on site
						33.3% of the time everywhere before a short video loops.
					</p>

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
}
