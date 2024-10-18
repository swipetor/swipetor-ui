import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { intOrDefault, Logger, LogLevels } from '@atas/weblib-ui-js';
import httpClient from 'src/utils/httpClient';
import { GetUsersApiResp } from 'src/types/ApiResponses';
import FollowButton from 'src/post/FollowButton';
import PostSummary from 'src/pages/user/PostSummary';
import UserMsgButton from 'src/pages/user/UserMsgButton';
import { setPageTitle } from 'src/utils/windowUtils';
import uiConfig from 'src/init/uiConfig';
import UploadedPhoto from 'src/components/UploadedPhoto';
import TopLogo from 'src/appshell/TopLogo';

export default function UserProfile() {
	const userId = intOrDefault(useParams<{ userId: string }>().userId);
	const [s, setS] = useState<GetUsersApiResp>();
	const navigate = useNavigate();
	const location = useLocation();
	const logger = new Logger(UserProfile, LogLevels.Info);

	const fetchUser = async () => {
		const userResp = await httpClient.get<GetUsersApiResp>(`/api/users/${userId}?includePosts=true`);

		if (!userResp.data.posts || userResp.data.posts.length === 0) return navigate('/');

		setS(userResp.data);
	};

	useEffect(() => {
		fetchUser();
	}, [userId]);

	useEffect(() => {
		if (!s?.user?.username) return;

		// Update current page
		const userUrl = `/u/${userId}/${s.user.username.toLowerCase()}`;
		if (location.pathname !== userUrl) {
			logger.info('Changing URL to post', userUrl);
			navigate(userUrl);
		}
	}, [s]);

	if (!s?.user) return null;

	setPageTitle(uiConfig.site.userProfileTitle.replace(/\{username}/g, s.user.username));

	return (
		<>
			<TopLogo />
			<div className="userProfileDiv">
				<div className="userProfileTopRow">
					<h1>
						<UploadedPhoto photo={s.user.photo} size={64} />@{s.user.username}
					</h1>

					<div className="actionBtns">
						<FollowButton user={s.user} onChange={async () => fetchUser()} />
						&nbsp;
						<UserMsgButton user={s.user} canMsg={s.canMsg} pmThreadId={s.pmThreadId} showMsgText />
					</div>
				</div>

				<p>{s.user.description || uiConfig.site.userProfileDesc.replace(/\{username}/g, s.user.username)}</p>

				{s.posts?.map((p, i) => <PostSummary key={i} post={p} />)}

				<p>&nbsp;</p>
				<p>&nbsp;</p>
			</div>
		</>
	);
}
