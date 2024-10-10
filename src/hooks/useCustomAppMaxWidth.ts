import { useEffect } from 'react';

function useCustomAppMaxWidth(width: string) {
	useEffect(() => {
		const appDiv = document.getElementById('app');
		if (!appDiv) return;

		appDiv.style.maxWidth = width;

		return () => {
			appDiv.style.maxWidth = '';
		};
	}, [width]);
}

export default useCustomAppMaxWidth;
