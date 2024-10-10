import React from 'react';

const pmThread = (
	<React.Fragment>
		<div className="ph-col-1">
			<div className="ph-avatar"></div>
		</div>
		<div>
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
				<div className="ph-col-6 big"></div>
				<div className="ph-col-6 big empty"></div>

				<div className="ph-col-8"></div>
				<div className="ph-col-4 empty"></div>
			</div>
		</div>

		<div className="ph-col-12">
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
			</div>
		</div>
	</React.Fragment>
);

export default function MsgThreadListLoading() {
	return (
		<div className="ph-item">
			{pmThread}
			{pmThread}
			{pmThread}
		</div>
	);
}
