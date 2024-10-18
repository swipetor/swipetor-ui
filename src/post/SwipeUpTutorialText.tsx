import React from 'react';

export default function SwipeUpTutorialText({ absolute }: { absolute: boolean }) {
	return <div className={`swipeUpTutorialText ${absolute ? 'abs' : ''}`}>Swipe Up for next ⬆</div>;
}
