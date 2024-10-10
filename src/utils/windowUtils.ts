import { shortenString } from '@atas/weblib-ui-js';
import uiConfig from 'src/init/uiConfig';
import { PostDto } from 'src/types/DTOs';

export function setPageTitle(title?: string | null) {
	if (!title) return setDefaultPageTitle();

	document.title = `${title}`;
}

export function setDefaultPageTitle() {
	document.title = `${uiConfig.site.name} - ${uiConfig.site.slogan}`;
}

export function setPageTitleFromPost(post?: PostDto | null) {
	if (!post) return setDefaultPageTitle();

	const postTitle = shortenString(post.title, 50);
	const author = post.user?.username ? shortenString(`by @${post.user?.username}`, 20) : '';

	const title = `${postTitle} ${author}`.trim();

	document.title = shortenString(title, 70)!;
}
