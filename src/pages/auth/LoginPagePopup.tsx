import React, { useRef } from 'react';
import DelayedButton from 'src/components/DelayedButton';
import httpClient from 'src/utils/httpClient';
import popupActions from 'src/redux/actions/popupActions';
import { SimpleSnackbarVariant, useFormValue } from '@atas/weblib-ui-js';
import uiConfig from 'src/init/uiConfig';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

interface Props {
	redirUrl?: string;
}

/**
 * @param props
 * @constructor
 */

export default function LoginPagePopup(props: Props) {
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const email = useFormValue('');
	const recaptcha = useFormValue(null, v => v);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const navigate = useNavigate();

	const sendLoginLink = async () => {
		try {
			setIsSubmitting(true);
			let recaptchaValue: string | null | undefined;
			try {
				recaptchaValue = await recaptchaRef.current?.executeAsync();
			} catch (e) {
				console.log(e);
				throw e;
			}

			const res = await httpClient.post<{ loginRequestId: string }>('/api/auth/email-login-code', {
				email: email.value,
				recaptchaValue,
			});

			if (res.status === 200) {
				popupActions.slidingPopup({ isOpen: false });
				popupActions.snackbarMsg(
					`Emailed to ${email.value}. Check spam folder too.`,
					SimpleSnackbarVariant.success,
				);

				navigate('/login/code?loginRequestId=' + res.data.loginRequestId);
			} else {
				popupActions.snackbarMsg('Something went wrong...', SimpleSnackbarVariant.error);
			}
		} finally {
			setIsSubmitting(false);
			recaptchaRef.current?.reset();
		}
	};

	return (
		<div className="loginPagePopup">
			<div className="helperText">
				Your email won't be visible to anyone, won't be shared and won't be spammed.
			</div>

			<p>
				<label className="matter-textfield-filled block">
					<input type="email" placeholder=" " {...email} />
					<span>Email address...</span>
				</label>
			</p>

			<p className="helperText">Single-use login code will be sent to your email.</p>

			<p className="block">
				<DelayedButton
					type="submit"
					disabled={isSubmitting}
					onDelayedClick={async () => sendLoginLink()}
					className="main red block">
					{isSubmitting ? 'Working...' : 'Login'}
				</DelayedButton>
			</p>

			<ReCAPTCHA
				style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				ref={recaptchaRef}
				sitekey={uiConfig.recaptcha?.key || ''}
				theme="dark"
				size={'invisible'}
				badge={'bottomright'}
				onChange={recaptcha.onChange}
			/>
		</div>
	);
}
