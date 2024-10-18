import { Logger, LogLevels } from '@atas/weblib-ui-js';
import SinglePlayer from 'src/libs/player/SinglePlayer';
import store from 'src/redux/store';
import { PostForUser } from 'src/types/DTOs';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

class PlayerProvider {
	private _players: SinglePlayer[] = new Array(5);
	private _hasTouched = false;

	private logger = new Logger('PlayerProvider', LogLevels.Warn, undefined, () => ({}));

	constructor() {
		const mutedStatus = localStorage.getItem('isMuted') === 'true';
		for (let i = 0; i < this._players.length; i++) {
			this._players[i] = new SinglePlayer(i, mutedStatus);
		}
	}

	/**
	 * Needs to be called when postIndex and mediaIndex change to active and play the video.
	 * @param postIndex
	 * @param mediaIndex
	 * @param userInitiated Player will only play if user initiated unless touched already
	 */
	async play(postIndex: number, mediaIndex: number, userInitiated = false) {
		this.logger.info(`play(${postIndex}, ${mediaIndex})`);

		if (!userInitiated && !this._hasTouched) return this.logger.info("Won't play because user hasn't touched yet.");

		const player = this.getPlayerForIndex(postIndex, mediaIndex);

		if (!player) return;

		if (!this._hasTouched) {
			this.logger.info('play(): touching inactive players');
			this._hasTouched = true;
			this._players.filter(p => p !== player).forEach(async p => p.touch());
		} else {
			this._players.filter(p => p !== player).forEach(p => p.pause());
		}

		return player.play();
	}

	touchIfNotTouched() {
		if (!this._hasTouched) {
			this.logger.info('touchIfNotTouched(): touching ALL players');
			this._hasTouched = true;
			this._players.forEach(async p => p.touch());
		}
	}

	/**
	 * Gets the right player for a given postIndex and mediaIndex
	 * @param pix
	 * @param mix
	 */
	getPlayerForIndex(pix: number, mix: number) {
		const posts = store.getState().post.posts;
		if (!posts) return null;

		const post = posts[pix] as PostWithIndex<PostForUser>;
		const media = post.medias[mix];

		if (!media) throw new Error(`getPlayerForIndex(): Media not found, ix: ${pix}/${mix}, medias: ${post.medias}`);

		const playerIndex = pix % this._players.length;
		const player = this._players[playerIndex];

		player.changeMedia(media, pix, mix);

		return player;
	}
	//region Vanilla actions
	isPaused() {
		return this._players.every(p => p.isPaused());
	}

	pause(postId: number, mediaId: number) {
		this.logger.info(`pause()`);
		this.getPlayerForIndex(postId, mediaId)?.pause();
	}

	pauseAll() {
		this.logger.info(`pauseAll()`);
		this._players.forEach(p => p.pause());
	}

	mute(isMuted: boolean) {
		this._players.forEach(p => p.mute(isMuted));
	}

	printStatus() {
		const status = [];
		for (let i = 0; i < this._players.length; i++) {
			const p = this._players[i];
			status.push({
				playerId: p.playerId,
				pix: p._pix,
				mix: p._mix,
			});
		}

		this.logger.info('players status', status);
	}

	//endregion
}

const playerProvider = new PlayerProvider();

export default playerProvider;
