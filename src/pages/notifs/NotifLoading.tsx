import React from 'react';

const notifText = (
	<React.Fragment>
		<div className="ph-col-2">
			<div className="ph-avatar"></div>
		</div>
		<div>
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
				<div className="ph-col-12 big"></div>

				<div className="ph-col-2 big"></div>
				<div className="ph-col-2 big empty"></div>
				<div className="ph-col-2 big"></div>
				<div className="ph-col-2 big empty"></div>
				<div className="ph-col-2 big"></div>
			</div>
		</div>

		<div className="ph-col-12">
			<div className="ph-row">
				<div className="ph-col-12 empty"></div>
			</div>
		</div>
	</React.Fragment>
);

const NotifLoading = () => {
	return (
		<React.Fragment>
			<div className="box centeredPage">
				<div className="ph-item">
					{notifText}
					{notifText}
					{notifText}
				</div>
			</div>
		</React.Fragment>
	);
};

export default NotifLoading;
