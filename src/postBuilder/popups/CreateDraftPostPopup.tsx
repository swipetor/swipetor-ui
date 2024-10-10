import { SimpleSnackbarVariant } from '@atas/webapp-ui-shared';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupWrapper from 'src/popups/PopupWrapper';
import popupActions from 'src/redux/actions/popupActions';
import { PostDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';

interface CreateDraftPostPopupProps {
	onPostCreated?: (postId: number) => Promise<void>;
}

function CreateDraftPostPopup(props: CreateDraftPostPopupProps) {
	const [title, setTitle] = useState<string>('');
	const [okayButtonDisabled, setOkayButtonDisabled] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const okayBtnClick = async (): Promise<void> => {
		setOkayButtonDisabled(true);

		try {
			const result = await httpClient.post<PostDto>(`/api/posts/my-drafts`, {
				title: title,
			});

			if (props.onPostCreated) await props.onPostCreated(result.data.id);

			popupActions.snackbarMsg('New draft post is created', SimpleSnackbarVariant.success);
			navigate(`/post-builder/${result.data.id}`);
		} finally {
			setOkayButtonDisabled(false);
			popupActions.hideGlobalPopupComponent();
		}
	};

	return (
		<PopupWrapper title="Add Draft Post" okayBtnClick={okayBtnClick}>
			<div style={{ minWidth: 300 }}>
				<label className="matter-textfield-filled block">
					<input
						value={title}
						placeholder=" "
						ref={inputRef}
						autoFocus
						onChange={e => setTitle(e.target.value)}
						disabled={okayButtonDisabled}
					/>
					<span>Post title</span>
				</label>
			</div>
		</PopupWrapper>
	);
}

export default CreateDraftPostPopup;
