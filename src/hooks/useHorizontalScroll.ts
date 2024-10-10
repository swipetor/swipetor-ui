import { RefObject, useEffect, useState } from 'react';

export function useHorizontalScroll(containerRef: RefObject<HTMLDivElement>) {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const scrollLeft = containerRef.current.scrollLeft;
				const width = containerRef.current.clientWidth;
				const newIndex = Math.round(scrollLeft / width);
				setActiveIndex(newIndex);
			}
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, [containerRef]);

	return activeIndex;
}
