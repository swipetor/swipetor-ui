import uiConfig from 'src/init/uiConfig';
import CPrice from 'src/types/CPrice';
import { Currency } from 'src/types/enums';

export default {
	/**
	 * Symbol currency representation
	 */
	getDefault() {
		return this.toSymbol(this.getDefaultIso());
	},

	/**
	 * 3 letter currency representation
	 */
	getDefaultIso() {
		return uiConfig.site.defaultCurrency;
	},

	tripleSymbol() {
		const c = this.getDefault();
		return c + c + c;
	},

	toSymbol(currency?: Currency | null) {
		if (!currency) return 'NULL';

		if (currency === Currency.EUR) return '€';
		if (currency === Currency.USD) return '$';
		if (currency === Currency.GBP) return '£';

		throw new Error(`The currency ${currency} is not found.`);
	},

	toString(cPrice: CPrice) {
		if (!cPrice || !cPrice.currency || !cPrice.price) return 'NaN';

		const cSymbol = this.toSymbol(cPrice.currency);
		return `${cSymbol}${cPrice.price.toFixed(2)}`;
	},
};
