import { SimpleSnackbarVariant } from '@atas/webapp-ui-shared';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DelayedButton from 'src/components/DelayedButton';
import UserSelect from 'src/components/UserSelect';
import pmActions from 'src/redux/actions/pmActions';
import popupActions from 'src/redux/actions/popupActions';
import { useUIStore } from 'src/redux/reduxUtils';
import { PmThreadDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';
import pmUtils from './pmUtils';
import { UserRole } from 'src/types/enums';

export default function NewPmPopup() {
	const currentUser = useUIStore(s => s.my.user);

	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
	const [introMsg, setIntroMsg] = useState<string>('');
	const [threadSuggestions, setThreadSuggestions] = useState<PmThreadDto[]>([]);

	const navigate = useNavigate();
	const location = useLocation();

	const go = async () => {
		if (threadSuggestions.length > 0) {
			const firstThread = threadSuggestions[0];
			navigate(`/pm/${firstThread.id}`);
			return popupActions.fullScreenPopup({ isOpen: false });
		}

		if (selectedUserIds.length === 0) {
			return popupActions.snackbarMsg(
				'Please enter usernames to start a PM thread.',
				SimpleSnackbarVariant.error,
			);
		}

		await httpClient.post<PmThreadDto>('/api/pm/invite', {
			userIds: selectedUserIds.join(','),
			intro: introMsg,
		});

		popupActions.fullScreenPopup({ isOpen: false });

		// If we are on PM pages, refresh the threads list
		location.pathname.startsWith('/pm') && pmActions.fetchThreads();
	};

	const checkIfThereIsThread = async () => {
		const res = await httpClient.get<PmThreadDto[]>('/api/pm/threads?userIds=' + selectedUserIds.join(','));
		setThreadSuggestions(res.data);
	};

	const onUserSelect = (userIds: number[]) => {
		setSelectedUserIds(userIds);
		checkIfThereIsThread();
	};

	const shouldShowCreateNewThread = () => {
		let threadUserIds = selectedUserIds;
		currentUser && threadUserIds.push(currentUser?.id);
		threadUserIds = [...new Set(threadUserIds)];

		if (threadUserIds.length === 1) return false;

		return !threadSuggestions?.some(
			t =>
				t.threadUsers?.every(tu => threadUserIds.includes(tu.userId)) &&
				t.threadUsers.length === threadUserIds.length,
		);
	};

	return (
		<div className="newPmPopup">
			<form
				onSubmit={(event: any) => {
					event.preventDefault();
					go();
				}}>
				<div className="userSelectBar">
					<UserSelect
						name="users"
						minRole={UserRole.TenantEditor}
						onChange={userIds => onUserSelect(userIds)}
					/>
					<input type="submit" style={{ visibility: 'hidden' }} />
				</div>

				<br />

				<div>
					{threadSuggestions?.map(t => (
						<DelayedButton
							key={t.id}
							onDelayedClick={() => undefined}
							className="mainBtn grey block textLeft">
							{pmUtils.getThreadName(t.threadUsers, true, currentUser?.id)}
						</DelayedButton>
					))}
				</div>

				{shouldShowCreateNewThread() && (
					<React.Fragment>
						<label className="matter-textfield-filled block">
							<input placeholder=" " onChange={e => setIntroMsg(e.currentTarget.value)} maxLength={120} />
							<span>Short intro message... {introMsg.length}/120</span>
						</label>

						<br />

						<button type="submit" className="goBtn mainBtn">
							Invite to conversation&nbsp;&nbsp;
							<span className="icon material-icons-outlined">send </span>
						</button>
					</React.Fragment>
				)}
			</form>
		</div>
	);
}
