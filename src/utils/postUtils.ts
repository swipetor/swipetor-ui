import { convertToSlug, copyToClipboard, detectBrowser, Logger, LogLevels } from '@atas/weblib-ui-js';
import popupActions from 'src/redux/actions/popupActions';
import { PostDto, PostForUser, PostMediaDto, UserDto } from 'src/types/DTOs';
import querystring from 'query-string';
import uiConfig from 'src/init/uiConfig';

export function stripTags(str?: string | null) {
	if (!str || str === '') return str;
	else str = str.toString();

	// Regular expression to identify HTML tags in
	// the input string. Replacing the identified
	// HTML tag with a null string.
	return str.replace(/(<([^>]+)>)/gi, '');
}

export async function sharePostOrCopyLink(post: PostDto, currentUserId?: number) {
	if (detectBrowser.isTouchDevice() && navigator.share) {
		await navigator.share({
			title: uiConfig.site.name,
			text: `Watch "${post.title}" post on ${uiConfig.site.name}`,
			url: getPostUrl(post, { rfid: currentUserId }),
		});
	} else {
		copyPostLink(post, currentUserId);
	}
}

export function copyPostLink(post: PostDto, currentUserId?: number, msg?: string | null) {
	copyToClipboard(getPostUrl(post, { rfid: currentUserId, includeDomain: true }));
	msg !== null && popupActions.snackbarMsg(msg || `Post url is copied.`);
}

export function isMediaExclusive(post?: PostDto | null, media?: PostMediaDto) {
	return !!media?.isFollowersOnly || media?.subPlanId;
}

export function getPostUrl(
	post: PostDto,
	opts: { hubId?: number; rfid?: number; includeDomain?: boolean; userId?: number } = {},
) {
	const query = {
		hubId: opts.hubId === 0 ? undefined : opts.hubId,
		rfid: opts.rfid,
		userId: opts.userId,
	};

	const slugTitle = `${convertToSlug(post.title)}-by-${convertToSlug(post.user?.username || '')}`;
	const u = `/p/${post.id}/${slugTitle}`;

	const url = querystring.stringifyUrl(
		{
			url: u,
			query,
		},
		{
			skipEmptyString: true,
			skipNull: true,
		},
	);

	if (opts.includeDomain) return `https://${uiConfig.site.hostname}${url}`;

	return url;
}

export function canRevealMedia(post: PostForUser, isPushNotifGranted: boolean, user?: UserDto) {
	const logger = new Logger('canRevealMedia()', LogLevels.Warn);
	logger.info('canRevealMedia()', post, isPushNotifGranted, user, +new Date() / 1000);

	if (user && user.premiumUntil >= +new Date() / 1000) return true;

	const isStandaloneApp = (window.navigator as any).standalone;
	const isIos = detectBrowser.isiOS();

	if (post.user?.userFollows && isPushNotifGranted) {
		if (isIos && isStandaloneApp) {
			return true;
		} else if (!isIos) {
			return true;
		}
	}
	return false;
}
