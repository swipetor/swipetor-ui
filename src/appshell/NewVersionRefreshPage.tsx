import React from 'react';
import { useUIStore } from 'src/redux/reduxUtils';
import config from 'src/config/config';

export default function NewVersionRefreshPage() {
	const uiVersion = useUIStore(s => s.appshell.uiVersion);

	if (!uiVersion) return null;

	if (config.version.toString().trim() === uiVersion.toString().trim()) return null;

	return (
		<div id="newVersionRefreshBar">
			<a href="#" onClick={() => location.reload()} className="mainBtn">
				New app version—Reload
			</a>
		</div>
	);
}
