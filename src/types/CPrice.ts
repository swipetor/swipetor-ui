import { Currency } from 'src/types/enums';

export default interface CPrice {
	price: number | null;
	currency: Currency | null;
}
