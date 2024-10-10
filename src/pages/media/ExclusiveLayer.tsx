import React from 'react';
import { useSelector } from 'react-redux';
import { UIState } from 'src/redux/reducers/reducers';
import * as postUtils from 'src/utils/postUtils';
import popupActions from 'src/redux/actions/popupActions';
import DelayedButton from 'src/components/DelayedButton';
import { PostForUser, PostMediaDto } from 'src/types/DTOs';
import ExclusiveForFollowersButton from 'src/pages/media/ExclusiveForFollowersButton';
import { secondsToPrettyDuration, SimpleSnackbarVariant } from '@atas/weblib-ui-js';
import currencyUtils from 'src/utils/currencyUtils';
import { PostMediaType } from 'src/types/enums';
import ExclusiveMediaDesc from 'src/pages/media/ExclusiveMediaDesc';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

interface Props {
	post: PostWithIndex;
	media: PostMediaDto;
}

export default function ExclusiveLayer({ post, media }: Props) {
	const user = useSelector((state: UIState) => state.my.user);

	const viewFreeBtnClick = () => {
		postUtils.copyPostLink(post, user?.id, null);
		popupActions.snackbarMsg('Copied. Share & view all for a week unrestricted.');
	};

	if (!postUtils.isMediaExclusive(post, media)) return null;

	const isVideo = () => media.type === PostMediaType.Video;
	const isPhoto = () => media.type === PostMediaType.Photo;
	const type = isVideo() ? secondsToPrettyDuration(media.video?.duration || 0) + ' video' : 'photo';

	return (
		<div className="exclusiveLayer">
			<div className="contentBg">
				<div className="exclusiveContentDiv">
					<div className="exclusiveInfo">Exclusive {type}</div>

					{!media.subPlanId && <ExclusiveForFollowersButton post={post} media={media} />}

					{!!media.subPlanId && (
						<DelayedButton
							loggedInOnly
							onDelayedClick={() =>
								popupActions.snackbarMsg(
									'Subscription system is being implemented.',
									SimpleSnackbarVariant.info,
								)
							}
							className="main gold block">
							<span>
								Be {media.subPlan?.name} for{' '}
								{media.subPlan?.cPrice ? currencyUtils.toString(media.subPlan?.cPrice) : ''}/mo
							</span>
						</DelayedButton>
					)}

					<DelayedButton
						loggedInOnly
						loginRedirUrl={`/p/${post.id}`}
						onDelayedClick={viewFreeBtnClick}
						style={{ marginTop: '10px' }}
						className="main white block">
						Share & 1wk Premium
					</DelayedButton>

					<ExclusiveMediaDesc media={media} />
				</div>
			</div>
		</div>
	);
}
