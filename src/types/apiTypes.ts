import { HubDto, UserDto } from 'src/types/DTOs';
import { Dictionary } from 'ts-essentials';

export interface IGoogleCustomSearchJson {
	kind: string;
	url: { type: string; template: string };
	queries: { queries: any; nextPage: any };
	context: { title: string };
	searchInformation: { searchTime: any; formatterSearchTime: any; totalResults: any; formattedTotalResults: any };
	items: IGoogleCustomSearchItem[];
}

export interface IGoogleCustomSearchItem {
	kind: string;
	title: string;
	htmlTitle: string;
	link: string;
	displayLink: string;
	snippet: string;
	htmlSnippet: string;
	mime: string;
	image: { contextLink: string; height: number; width: number; byteSize: number };
}

export interface IApiMyResult {
	user: UserDto;
	places: [{ id: number; name: string }];
}

export interface PingResult {
	unreadNotifCount?: number;
	unreadPmCount?: number;
	uiVersion: string;
	user: UserDto;
}

export interface HubsApiResp {
	hubsById: Dictionary<HubDto>;
}
