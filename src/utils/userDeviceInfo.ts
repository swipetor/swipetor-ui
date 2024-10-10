export interface UserDeviceInfo {
	isBot: boolean;
}

const userDeviceInfo = (window as any).userDeviceInfo as UserDeviceInfo;

export default userDeviceInfo;
