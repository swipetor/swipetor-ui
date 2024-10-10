import { Action } from 'redux';
import StateActionType from 'src/redux/actions/stateActionType';
import { HubDto } from 'src/types/DTOs';
import { Dictionary } from 'ts-essentials';

export interface HubState {
	hubsById: Dictionary<HubDto>;
}

const initialState: HubState = {
	hubsById: {},
};

export default function (state = initialState, action: any): HubState {
	if (action.type === StateActionType.HUB_SET_ALL) {
		const a = action as HubSetAllAction;

		return {
			...state,
			hubsById: a.hubsById ?? {},
		};
	}

	return state;
}

export interface HubSetAllAction extends Action<StateActionType.HUB_SET_ALL> {
	hubsById: { [k: number]: HubDto };
}
