import { MentionsTextareaBase } from '@atas/weblib-ui-js';
import React from 'react';
import { MentionsInputProps, SuggestionDataItem } from 'react-mentions';
import { UserDto } from 'src/types/DTOs';
import httpClient from 'src/utils/httpClient';

async function mentionsFetchFn(word: string, cb: (data: SuggestionDataItem[]) => void) {
	if (word.length >= 3) {
		const usersData = await httpClient.get<UserDto[]>(`/api/users/search?username=${word}`);

		const users = usersData.data.map(u => ({ id: u.id, display: `@${u.username}` }));

		cb(users);
	}
}

type MentionsTextareaProps = Partial;

export function Mentions(props: MentionsTextareaProps) {
	return <MentionsTextareaBase {...props} mentionsFetchFn={mentionsFetchFn} />;
}

export const mentionUtils = {
	mentionsFormatText(txt: string) {
		return txt.replace(/@\[@([^\]]+)]\(([0-9]+)\)/, '@$1');
	},
};
