import React, { useEffect, useState } from 'react';
import PopupWrapper from 'src/popups/PopupWrapper';
import popupActions from 'src/redux/actions/popupActions';
import httpClient from 'src/utils/httpClient';

interface Props {
	postId?: number;
	title?: string;
	refresh(): void;
}

const EditPostTitlePopup: React.FC<Props> = ({ postId, title, refresh }) => {
	const [currentTitle, setCurrentTitle] = useState<string>(title || '');

	const okayBtnClick = async (): Promise<void> => {
		await httpClient.put(`/api/posts/${postId}/title`, {
			title: currentTitle,
		});

		refresh();
		popupActions.hideGlobalPopupComponent();
	};

	useEffect(() => {
		setCurrentTitle(title || '');
	}, [postId]);

	return (
		<PopupWrapper title="Edit post title" okayBtnClick={async () => await okayBtnClick()}>
			<div style={{ minWidth: 300 }}>
				<label className="matter-textfield-filled block">
					<input value={currentTitle} placeholder=" " onChange={e => setCurrentTitle(e.target.value)} />
					<span>Post title</span>
				</label>
			</div>
		</PopupWrapper>
	);
};

export default EditPostTitlePopup;
