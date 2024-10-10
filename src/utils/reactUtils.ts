import { useEffect } from 'react';

export function useEffectAsync(fn: () => Promise<any>, deps: any[]) {
	useEffect(() => {
		const execute = async () => {
			await fn();
		};
		execute();
	}, deps);
}
