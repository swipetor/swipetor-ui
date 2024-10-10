import React from 'react';

export function EmptyPostsPanel() {
	return (
		<React.Fragment>
			<div className="topLogoSpacer"></div>

			<div className="panelColumn postsPanel">
				<div className="empty">
					<div className="emptyMsg">Come as guest, stay as family 👨‍👩‍👧‍👧</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export function EmptyPmMsgsPanel() {
	return (
		<React.Fragment>
			<div id="pmMsgsPanel" className="panelColumn">
				<div className="empty">
					<div className="emptyMsg">Your network, is your net worth.</div>
				</div>
			</div>
		</React.Fragment>
	);
}
