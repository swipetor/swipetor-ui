import { Logger, LogLevels } from '@atas/weblib-ui-js';
import SinglePlayer from 'src/libs/player/SinglePlayer';
import store from 'src/redux/store';
import { PostForUser } from 'src/types/DTOs';
import { PostWithIndex } from 'src/redux/reducers/postReducer';

class PlayerProvider {
	private _players: SinglePlayer[] = new Array(5);
	private _hasTouched = false;

	private logger = new Logger('PlayerProvider', LogLevels.Verbose, undefined, () => ({}));

	constructor() {
		const mutedStatus = localStorage.getItem('isMuted') === 'true';
		for (let i = 0; i < this._players.length; i++) {
			this._players[i] = new SinglePlayer(i, mutedStatus);
		}
	}

	/**
	 * Needs to be called when postIndex and mediaIndex change to active and play the video.
	 * @param pix
	 * @param userInitiated Player will only play if user initiated unless touched already
	 */
	async play(pix: number, userInitiated = false) {
		this.logger.info(`play(${pix})`);

		if (!userInitiated && !this._hasTouched) return this.logger.info("Won't play because user hasn't touched yet.");

		const player = this.getPlayerForIndex(pix);

		this.logger.info('play(): Received player #' + player?.playerId, this._players);

		if (!player) return;

		if (!this._hasTouched) {
			this.logger.info('play(): touching inactive players');
			this._hasTouched = true;
			this._players
				.filter(p => p.playerId !== player.playerId)
				.forEach(async p => {
					this.logger.info('play(): touching player', p.playerId);
					try {
						return p.touch();
					} catch (e) {
						this.logger.error('Exception', e);
					}
				});
		} else {
			this._players
				.filter(p => p.playerId !== player.playerId)
				.forEach(p => {
					this.logger.info('play(): pausing player', p.playerId);
					try {
						return p.pause();
					} catch (e) {
						this.logger.error('Exception', e);
					}
				});
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
	 */
	getPlayerForIndex(pix: number) {
		const posts = store.getState().post.posts;
		if (!posts) return null;

		const player = this._players[pix % this._players.length];

		const anyPost = posts[pix];
		if (anyPost.type === 'StaticPostType') {
			this.logger.info('getPlayerForIndex(): Static post, changing media to black frame');
			player.changeMedia(pix);
		} else {
			const post = posts[pix] as PostWithIndex<PostForUser>;
			const media = post?.medias[0];
			this.logger.info('getPlayerForIndex(): Post', post, media);
			if (!media) throw new Error(`getPlayerForIndex(): Media not found for pix ${pix}, medias: ${post.medias}`);
			player.changeMedia(pix, media);
		}
		return player;
	}
	//region Vanilla actions
	isPaused() {
		return this._players.every(p => p.isPaused());
	}

	pause(pix: number) {
		this.logger.info(`pause()`);
		this.getPlayerForIndex(pix)?.pause();
	}

	pauseAll() {
		this.logger.info(`pauseAll()`);
		this._players.forEach(p => {
			try {
				p.pause();
			} catch (e) {
				this.logger.error('Exception', e);
			}
		});
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
			});
		}

		this.logger.info('players status', status);
	}

	//endregion
}

const playerProvider = new PlayerProvider();

export default playerProvider;
