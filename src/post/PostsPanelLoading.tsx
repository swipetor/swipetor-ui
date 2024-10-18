import React from 'react';

const postsPanelText = (
	<React.Fragment>
		<div>
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
				<div className="ph-col-3"></div>
				<div className="ph-col-8 empty"></div>
				<div className="ph-col-1"></div>
			</div>

			<div className="ph-row">
				<div className="ph-col-12 empty"></div>

				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>
				<div className="ph-col-12 big" style={{ marginBottom: 0 }}></div>

				<div className="ph-col-12"></div>
			</div>

			<div className="ph-row">
				<div className="ph-col-12 empty">
					<div className="ph-avatar" style={{ width: '60px', height: '60px' }}></div>
				</div>
				<div className="ph-col-1 empty"></div>
				<div className="ph-col-6 empty"></div>
				<div className="ph-col-4 empty"></div>
				<div className="ph-col-1"></div>
			</div>

			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
			</div>
		</div>
	</React.Fragment>
);

export default function PostsPanelLoading() {
	return <div className="ph-item">{postsPanelText}</div>;
}
