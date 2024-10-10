import React from 'react';
import DelayedButton from 'src/components/DelayedButton';
import PostBuilderPhoto from 'src/postBuilder/mediaItems/PostBuilderPhoto';
import PostBuilderVideo from 'src/postBuilder/mediaItems/PostBuilderVideo';
import popupActions from 'src/redux/actions/popupActions';
import { PostMediaDto } from 'src/types/DTOs';
import { PostMediaType } from 'src/types/enums';
import httpClient from 'src/utils/httpClient';
import { usePostBuilderContext } from 'src/postBuilder/PostBuilderContext';
import Select, { SingleValue } from 'react-select';

interface Props {
	media: PostMediaDto;
	counter: number;
}

export default function PostBuilderMediaFrame(props: Props) {
	const { refreshPost, updateMedia, s } = usePostBuilderContext();
	const selectedSubPlan = props.media.id ? s.subPlans.find(sp => sp.id === props.media.subPlanId) : null;

	const selectedSubPlanSelectOption = selectedSubPlan
		? { label: selectedSubPlan.name || '', value: selectedSubPlan.id }
		: null;

	function showDeletePopup() {
		popupActions.popupMsg({
			title: 'Delete?',
			content: 'Are you sure to delete this media item?',
			okayBtnClick: async () => del(),
		});
	}

	async function duplicate() {
		await httpClient.post(`/api/medias/${props.media.id}/duplicate`);
		refreshPost();
	}

	async function del() {
		await httpClient.delete(`/api/medias/${props.media.id}`);
		refreshPost();
	}

	async function move(direction: 'up' | 'down') {
		await httpClient.get(`/api/medias/${props.media.id}/move?direction=${direction}`);
		refreshPost();
	}

	return (
		<div className="postBuilderMediaFrame">
			<DelayedButton onDelayedClick={() => showDeletePopup()} style={{ float: 'right' }}>
				<span className="material-icons" style={{ fontSize: '32px' }}>
					delete
				</span>
			</DelayedButton>

			<DelayedButton onDelayedClick={async () => move('down')} style={{ float: 'right' }}>
				<span className="material-icons" style={{ fontSize: '32px' }}>
					arrow_downward
				</span>
			</DelayedButton>

			<DelayedButton onDelayedClick={async () => move('up')} style={{ float: 'right' }}>
				<span className="material-icons" style={{ fontSize: '32px' }}>
					arrow_upward
				</span>
			</DelayedButton>

			<DelayedButton
				onDelayedClick={async () => duplicate()}
				title="Duplicate"
				style={{ float: 'right' }}
				className="mainBtn white">
				Duplicate
			</DelayedButton>

			<h2>
				#{props.counter + 1} {PostMediaType[props.media.type]}
			</h2>

			{props.media.type === PostMediaType.Photo && <PostBuilderPhoto media={props.media} />}

			{props.media.type === PostMediaType.Video && <PostBuilderVideo media={props.media} />}

			<p className="block">
				<label className="matter-textfield-filled block">
					<input
						value={props.media.description || ''}
						placeholder=" "
						onChange={e => {
							updateMedia(props.media.id, { description: e.target.value });
						}}
						maxLength={512}
					/>
					<span>Description</span>
				</label>
			</p>

			{props.counter > 0 && (
				<>
					<p className="block">
						<img
							src="/public/images/followers.svg"
							alt=""
							className="prizeImg left"
							style={{
								width: 64,
								paddingRight: 10,
								filter: props.counter === 0 ? 'grayscale(1)' : '',
							}}
						/>
						<label className="matter-checkbox">
							<input
								type="checkbox"
								checked={props.media.isFollowersOnly}
								onChange={e => updateMedia(props.media.id, { isFollowersOnly: e.target.checked })}
							/>
							<span>Followers Only?</span>
						</label>
						<br />
						<span className="helperText">Make this post item only available to users who follow you.</span>
					</p>
					<div className="block" style={{ display: 'flex', alignItems: 'center' }}>
						<img
							src="/public/images/coin_dollar_lock.svg"
							alt=""
							className="prizeImg left"
							style={{
								width: 64,
								paddingRight: 10,
								filter: props.counter === 0 ? 'grayscale(1)' : '',
							}}
						/>
						<Select
							value={selectedSubPlanSelectOption}
							onChange={(option: SingleValue<{ value: number; label: string }>) => {
								updateMedia(props.media.id, { subPlanId: option?.value || null });
							}}
							options={s.subPlans.map(sp => ({ value: sp.id, label: sp.name }))}
							placeholder="Subscription Plan"
							isSearchable={false}
							isClearable
							className="react-select-container"
							classNamePrefix="react-select"
						/>
					</div>
				</>
			)}

			<p className="block"></p>
		</div>
	);
}
