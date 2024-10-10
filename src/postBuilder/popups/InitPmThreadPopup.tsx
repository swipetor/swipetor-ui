import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PmInitForm, { PmInitFormRef } from 'src/pages/pm/PmInitForm';
import PopupWrapper from 'src/popups/PopupWrapper';
import popupActions from 'src/redux/actions/popupActions';
import { PostDto } from 'src/types/DTOs';

interface Props {
	userToMsg: { id: number; username: string };
	post?: PostDto;
}

const InitPmThreadPopup: React.FC<Props> = ({ userToMsg, post }) => {
	const ref = useRef<PmInitFormRef>(null);
	const navigate = useNavigate();

	const title = `Contact @${userToMsg.username}`;

	const okayBtnClick = async () => {
		const result = await ref.current?.handleSubmit();
		navigate(`/pm/${result?.threadId || ''}`);
		popupActions.hideGlobalPopupComponent();
	};

	return (
		<PopupWrapper
			title={title}
			okayBtnClick={okayBtnClick}
			okayBtnLabel={`Msg @${userToMsg.username}`}
			cancelBtnLabel={'Cancel'}>
			<PmInitForm ref={ref} hideButton userToMsg={userToMsg} post={post} />
		</PopupWrapper>
	);
};

export default InitPmThreadPopup;
