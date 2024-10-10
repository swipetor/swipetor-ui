import DelayedButton from 'src/components/DelayedButton';
import React, { useEffect, useMemo, useState } from 'react';
import popupActions from 'src/redux/actions/popupActions';
import { detectBrowser, Logger, LogLevels, SimpleSnackbarVariant } from '@atas/webapp-ui-shared';
import userActions from 'src/redux/actions/userActions';
import { PostForUser, PostMediaDto } from 'src/types/DTOs';
import { PostMediaType } from 'src/types/enums';
import FCM from 'src/init/FCM';
import { canRevealMedia } from 'src/utils/postUtils';
import httpClient from 'src/utils/httpClient';
import pubsub from 'src/libs/pubsub/pubsub';
import postActions from 'src/redux/actions/postActions';
import IosAddToHomeTutorial from 'src/pages/others/IosAddToHomeTutorial';
import PushNotifPerm from 'src/init/PushNotifPerm';
import { useUIStore } from 'src/redux/reduxUtils';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

interface Props {
	post: PostWithIndex<PostForUser>;
	media: PostMediaDto;
}

export default function ExclusiveForFollowersButton({ post, media }: Props) {
	const logger = new Logger('ExclusiveForFollowersButton', LogLevels.Warn);
	const user = useUIStore(state => state.my.user);
	const isPushNotifGranted = useUIStore(state => state.notifs.isPushNotifGranted);
	const [dummyUpdate, setDummyUpdate] = useState(0);

	logger.info('isPushNotifGranted', isPushNotifGranted);

	const criteria = useMemo(
		() => ({
			isFollowing: !!post.user?.userFollows,
			isIos: detectBrowser.isiOS(),
			isStandalone: (window.navigator as any).standalone,
			isWebPushGranted: isPushNotifGranted,
		}),
		[post, media, isPushNotifGranted],
	);

	useEffect(() => {
		pubsub.subscribe('RevealMedia', async (data: { mediaId: number }) => {
			logger.info('pubsub:RevealMedia captured', data, media.id);
			if (media.id === data.mediaId) {
				postActions.reveal(post.id);
			}
		});
		return () => {
			pubsub.unsubscribe('RevealMedia');
		};
	}, [post, media, isPushNotifGranted]);

	const processReveal = async () => {
		if (user?.premiumUntil && user.premiumUntil > +new Date() / 1000) {
			return postActions.reveal(post.id);
		}

		post.user && userActions.follow(post.user.id, true);

		//if ios
		if (criteria.isIos && !criteria.isStandalone) {
			return popupActions.popupMsg({
				title: 'Add to iPhone Home Screen',
				cancelBtn: null,
				actionCountdownSeconds: 5,
				hideTopCloseButton: true,
				content: () => <IosAddToHomeTutorial />,
			});
		}

		const pushNotifPerm = new PushNotifPerm();
		const notifResult = await pushNotifPerm.request(true, true, false);

		if (notifResult) {
			popupActions.snackbarMsg('Click on the sent push notification to reveal.', SimpleSnackbarVariant.info);
			const token = await FCM.getMessagingToken();
			await httpClient.post(`/api/medias/${media.id}/notif-reveal`, {
				token,
			});
			setDummyUpdate(d => d + 1);
		}
	};

	function revealMediaClick() {
		popupActions.popupMsg({
			title: 'Exclusive Content',
			isOpen: true,
			content: () => (
				<div className="exclusiveForFollowersPopupConditions">
					View the exclusive content, all free: <br />{' '}
					<ul>
						<li>
							{criteria.isFollowing ? '✅' : '❌'} Follow @{post.user?.username}
						</li>
						{criteria.isIos && (
							<li>
								{(window.navigator as any).standalone ? '✅' : '❌'} Add Swipetor to Home Screen like an
								app
								<br />
								<span className="helperText">iPhone requires this to enable push notifications</span>
							</li>
						)}
						<li>
							{criteria.isWebPushGranted ? '✅' : '❌'} Enable push notifications for new posts
							<br />
							<span className="helperText">Max 1 per day for everyone you follow</span>
						</li>
					</ul>
				</div>
			),
			okayBtn: 'Do it',
			okayBtnClick: async () => processReveal(),
		});
	}

	const canReveal = canRevealMedia(post, isPushNotifGranted, user);

	const isVideo = () => media.type === PostMediaType.Video;
	const isPhoto = () => media.type === PostMediaType.Photo;
	const type = isVideo() ? ' video' : 'photo';

	return (
		<>
			{!canReveal && (
				<DelayedButton loggedInOnly onDelayedClick={revealMediaClick} className="main gold block">
					<span>View the {type}</span>
				</DelayedButton>
			)}
			{canReveal && (
				<DelayedButton loggedInOnly onDelayedClick={processReveal} className="main gold block">
					<span>You can play the {type}</span>
				</DelayedButton>
			)}
		</>
	);
}
