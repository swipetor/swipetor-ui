import React from 'react';
import DelayedButton from 'src/components/DelayedButton';
import popupActions from 'src/redux/actions/popupActions';
import userActions from 'src/redux/actions/userActions';
import { PublicUserDto } from 'src/types/DTOs';

interface Props {
	user: PublicUserDto;
	onChange?: () => void;
}

function unfollow(userId: number, onChange?: () => void) {
	popupActions.popupMsg({
		title: 'Unfollow',
		content: 'Are you sure you want to unfollow this user?',
		okayBtnClick: async () => {
			await userActions.follow(userId, false);
			onChange && onChange();
		},
	});
}

export default function FollowButton(props: Props) {
	return (
		<>
			{!props.user.userFollows && (
				<DelayedButton
					loggedInOnly
					onDelayedClick={async () => {
						await userActions.follow(props.user.id, true);
						props.onChange && props.onChange();
					}}
					className="mainBtn follow">
					<span className="material-icons"> add_circle </span>&nbsp;Follow
				</DelayedButton>
			)}

			{props.user.userFollows && (
				<DelayedButton
					loggedInOnly
					onDelayedClick={() => unfollow(props.user.id, props.onChange)}
					className="mainBtn grey follow">
					<span className="material-icons">check</span>
				</DelayedButton>
			)}
		</>
	);
}
