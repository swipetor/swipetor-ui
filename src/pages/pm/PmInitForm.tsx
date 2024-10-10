import React, { ForwardedRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import DelayedButton from 'src/components/DelayedButton';
import { UIState } from 'src/redux/reducers/reducers';
import { PmMsgDto, PostDto } from 'src/types/DTOs';
import currencyUtils from 'src/utils/currencyUtils';
import httpClient from 'src/utils/httpClient';
import { copyPostLink } from 'src/utils/postUtils';
import AutosizingTextarea from 'src/components/hubs/AutosizingTextarea';

interface Props {
	userToMsg: { id: number; username: string };
	post?: PostDto;
	className?: string;
	hideButton?: boolean;
}

export type PmInitFormRef = { handleSubmit: () => Promise<PmMsgDto> };

const PmInitForm = React.forwardRef(
	({ userToMsg, post, className, hideButton }: Props, ref: ForwardedRef<PmInitFormRef>) => {
		const [txt, setTxt] = useState('');
		const user = useSelector((state: UIState) => state.my.user);

		const handleSubmit = async () => {
			const result = await httpClient.post<PmMsgDto>(`/api/pm/init`, {
				userId: userToMsg.id,
				txt: txt,
			});
			return result.data;
		};

		// Expose the handleSubmit function to the parent component
		useImperativeHandle(ref, () => ({
			handleSubmit,
		}));

		return (
			<div className={`pmInitForm ${className}`}>
				<label className="matter-textfield-filled block">
					<AutosizingTextarea value={txt} placeholder=" " onChange={e => setTxt(e.target.value)} />
					<span>Write a message to start a chat thread</span>
				</label>

				{post && (
					<p>
						Want free {currencyUtils.tripleSymbol()}? Share this post
						<DelayedButton onDelayedClick={() => copyPostLink(post!, user?.id)}>
							<span className="material-icons">link</span>
						</DelayedButton>
					</p>
				)}

				{hideButton !== true && (
					<DelayedButton onDelayedClick={async () => handleSubmit()} className="main block">
						Contact
					</DelayedButton>
				)}
			</div>
		);
	},
);

PmInitForm.displayName = 'PmInitForm';

export default PmInitForm;
