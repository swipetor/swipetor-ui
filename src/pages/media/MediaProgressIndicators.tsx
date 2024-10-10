import React from 'react';
import { useSelector } from 'react-redux';
import { UIState } from 'src/redux/reducers/reducers';
import { PostDto, PostForUser } from 'src/types/DTOs';
import ProgressIndicators from 'src/components/ProgressIndicators';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

// <a href="https://www.youtube.com/watch?v=ifWpJEhAsg0" rel="noopener noreferrer" target="_blank">https://www.youtube.com/watch?v=ifWpJEhAsg0</a>

// const youtubeRegex = /(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
// const ytUrlRegex = '(?:https://)?(?:www.)?(?:youtube.com|youtu.be)/(?:watch?v=)?(.+)';
// const ytRegexWithATag = new RegExp(`<a href="${ytUrlRegex}"[^>]*>${ytUrlRegex}</a>`);

// const linkifyRegex = new RegExp('(http|https|ftp)://[a-zA-Z0-9-.]+.[a-zA-Z]{2,63}/?([^ ]|[^\\n])*');
// const linkifyRegexNoProtocol = new RegExp('[^(http|https|ftp)://][a-zA-Z0-9-.]+.[a-zA-Z]{2,63}/?([^ ]|[^\\n])');

export default function MediaProgressIndicators({ post }: { post: PostDto }) {
	const activePix = useSelector((state: UIState) => state.post.pix);
	const activeMix = useSelector((state: UIState) => state.post.mix);
	const activePost = useSelector(
		(state: UIState) => (state.post.posts || [])[activePix],
	) as PostWithIndex<PostForUser>;

	const activeIndex = activePost.id === post.id ? activeMix : 0;

	return <ProgressIndicators total={post.medias.length} active={activeIndex || 0} />;
}
