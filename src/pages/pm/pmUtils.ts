import { PmThreadUserDto } from 'src/types/DTOs';
import { shortenString } from '@atas/weblib-ui-js';

export default new (class PmUtils {
	getThreadName(threadUsers?: PmThreadUserDto[] | null, shortenNames = false, excludeUserId?: number) {
		if (!threadUsers) return null;

		const shortenFn = shortenNames ? (u?: string) => shortenString(u, 12) : (u?: string) => u;

		const name = threadUsers
			.filter(tu => tu.userId !== excludeUserId)
			.map(u => shortenFn(u.user?.username))
			.join(', ');

		return name;
	}
})();
