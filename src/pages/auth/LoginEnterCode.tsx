import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import httpClient from 'src/utils/httpClient';
import popupActions from 'src/redux/actions/popupActions';
import { SimpleSnackbarVariant, useFormValue } from '@atas/weblib-ui-js';
import DelayedButton from 'src/components/DelayedButton';
import uiConfig from 'src/init/uiConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'query-string';
import myActions from 'src/redux/actions/myActions';
import { setPageTitle } from 'src/utils/windowUtils';
import TopLogo from 'src/appshell/TopLogo';

export default function LoginEnterCode() {
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const loginCode = useFormValue('');
	const recaptcha = useFormValue(null, v => v);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const sendLoginLink = async () => {
		try {
			setIsSubmitting(true);
			const recaptchaValue = await recaptchaRef.current?.executeAsync();
			const queryParams = qs.parse(location.search);

			const res = await httpClient.post<{ hasUsername: boolean }>('/api/auth/submit-login-code', {
				loginRequestId: queryParams.loginRequestId,
				loginCode: loginCode.value,
				recaptchaValue,
			});

			popupActions.snackbarMsg('Logged in...', SimpleSnackbarVariant.success);

			await myActions.getMy();

			navigate(res.data.hasUsername ? '/' : '/my/first-login');
		} finally {
			setIsSubmitting(false);
			recaptchaRef.current?.reset();
		}
	};

	setPageTitle('Enter Login Code');

	return (
		<>
			<TopLogo />
			<h1>Enter Login Code</h1>
			<div className="box">
				<p className="center">Please enter the login code sent to your email address.</p>

				<div className="fadingLineCenter"></div>

				<p className="center">
					<u>
						Check <b>Spam/Junk</b> Folder of your email
					</u>
				</p>

				<p>
					<label className="matter-textfield-filled block">
						<input type="text" placeholder=" " {...loginCode} style={{ textTransform: 'uppercase' }} />
						<span>Login code...</span>
					</label>
				</p>

				<p className="block">
					<DelayedButton
						type="submit"
						disabled={isSubmitting}
						onDelayedClick={async () => sendLoginLink()}
						className="main red block">
						{isSubmitting ? 'Working...' : 'Submit Code'}
					</DelayedButton>
				</p>

				<ReCAPTCHA
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					ref={recaptchaRef}
					sitekey={uiConfig.recaptcha?.key || ''}
					theme="dark"
					size={'invisible'}
					badge={'inline'}
					onChange={recaptcha.onChange}
				/>
			</div>
		</>
	);
}
