import React from 'react';

const postTitleBar = (
	<div className="ph-col-12">
		<div className="ph-row">
			<div className="ph-col-2"></div>
			<div className="ph-col-8 empty"></div>
			<div className="ph-col-2"></div>
		</div>
	</div>
);

const postText = (
	<React.Fragment>
		<div className="ph-col-2">
			<div className="ph-avatar"></div>
		</div>
		<div>
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
				<div className="ph-col-4 big"></div>
				<div className="ph-col-8 big empty"></div>
				<div className="ph-col-2 big"></div>
				<div className="ph-col-10 big empty"></div>
			</div>
		</div>
	</React.Fragment>
);

const postImage = (
	<div className="ph-col-12">
		<div className="ph-picture"></div>
	</div>
);

export default function PostLoading() {
	return (
		<div className="box">
			<div className="ph-item">
				{postTitleBar}
				{postText}
				{postImage}

				<div className="ph-col-12">
					<div className="ph-row">
						<div className="ph-col-4 big"></div>
						<div className="ph-col-4 big empty"></div>
						<div className="ph-col-4 big"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
