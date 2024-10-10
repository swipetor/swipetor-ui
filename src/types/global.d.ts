// global.d.ts
import { UserDeviceInfo } from 'src/utils/userDeviceInfo';

export {};

declare global {
	interface Window {
		userDeviceInfo?: UserDeviceInfo;
	}
}
