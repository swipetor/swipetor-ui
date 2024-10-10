import React, { useEffect, useState } from 'react';
import httpClient from 'src/utils/httpClient';
import popupActions from 'src/redux/actions/popupActions';
import { SimpleSnackbarVariant } from '@atas/weblib-ui-js';
import DelayedButton from 'src/components/DelayedButton';
import { CustomDomainDto } from 'src/types/DTOs';
import H1BackBtn from 'src/components/H1BackBtn';
import TopLogo from 'src/appshell/TopLogo';

export default function MyCustomDomain() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [domainName, setDomainName] = useState('');
	const [recaptchaKey, setRecaptchaKey] = useState('');
	const [recaptchaSecret, setRecaptchaSecret] = useState('');

	useEffect(() => {
		fetch();
	}, []);

	const fetch = async () => {
		const resp = await httpClient.get<CustomDomainDto | null>('/api/my/custom-domain');
		setDomainName(resp.data?.domainName || '');
		setRecaptchaKey(resp.data?.recaptchaKey || '');
		setRecaptchaSecret(resp.data?.recaptchaSecret || '');
	};

	const submitProfileDescription = async () => {
		try {
			setIsSubmitting(true);
			await httpClient.put('/api/my/custom-domain', {
				domainName,
				recaptchaKey,
				recaptchaSecret,
			});
			popupActions.snackbarMsg('Profile description updated.', SimpleSnackbarVariant.success);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<TopLogo />
			<h1>
				<H1BackBtn fallbackUrl="/my" />
				&nbsp; Custom Domain
			</h1>
			<div className="box">
				<p>
					<label className="matter-textfield-filled block">
						<input
							type="text"
							placeholder=" "
							value={domainName}
							maxLength={64}
							onChange={e => setDomainName(e.target.value)}
						/>
						<span>Custom web domain...</span>
					</label>

					<span className="helperText">
						e.g. www.yoursite.com
						<br />
						If you set a custom domain, Swipetor will run on your domain with only your profile.
						<br />
						You should own a domain name, add it to{' '}
						<a href="https://www.cloudflare.com" target="_blank" rel="noreferrer">
							CloudFlare
						</a>{' '}
						then set CNAME for www.yourdomain.com to cname.swipetor.com and SSL/TLS in CloudFlare to "Full".
					</span>
				</p>

				<p>
					<label className="matter-textfield-filled block">
						<input
							type="text"
							placeholder=" "
							value={recaptchaKey}
							maxLength={128}
							onChange={e => setRecaptchaKey(e.target.value)}
						/>
						<span>Recaptcha Key...</span>
					</label>

					<br />

					<label className="matter-textfield-filled block">
						<input
							type="text"
							placeholder=" "
							value={recaptchaSecret}
							maxLength={128}
							onChange={e => setRecaptchaSecret(e.target.value)}
						/>
						<span>Recaptcha Key...</span>
					</label>

					<span className="helperText">
						You need your own Recaptcha key to use it on your custom domain.
						<a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noreferrer">
							https://www.google.com/recaptcha/admin
						</a>
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
		</>
	);
}
