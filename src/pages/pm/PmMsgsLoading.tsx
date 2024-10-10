import React from 'react';
import DelayedLink from 'src/components/DelayedLink';

const pmThread = (
	<React.Fragment>
		<div className="ph-col-1">
			<div className="ph-avatar" style={{ width: 50 }}></div>
		</div>
		<div>
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
				<div className="ph-col-6"></div>
				<div className="ph-col-6 empty"></div>

				<div className="ph-col-8"></div>
				<div className="ph-col-4 empty"></div>
			</div>
		</div>

		<div className="ph-col-12">
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
			</div>
		</div>

		<div className="ph-col-10">
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
				<div className="ph-col-6 empty"></div>
				<div className="ph-col-6"></div>

				<div className="ph-col-8 empty"></div>
				<div className="ph-col-4"></div>
			</div>
		</div>
		<div className="ph-col-2">
			<div className="ph-avatar" style={{ width: 50 }}></div>
		</div>

		<div className="ph-col-12">
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
			</div>
		</div>
	</React.Fragment>
);

export default function PmMsgsLoading() {
	return (
		<div className="panelColumn pmMsgsPanel">
			<div className="header">
				<div className="left">
					<DelayedLink to="/pm" className="btn iconText">
						<span className="icon material-icons-outlined">arrow_back</span>
					</DelayedLink>
				</div>
			</div>

			<div className="body">
				<div className="ph-item">
					{pmThread}
					{pmThread}
					{pmThread}
				</div>
			</div>
		</div>
	);
}
