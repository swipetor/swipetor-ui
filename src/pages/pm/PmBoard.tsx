import React from 'react';
import Media from 'react-media';
import { Route, Routes } from 'react-router-dom';
import PmMsgsPanel from './PmMsgsPanel';
import PmThreadsPanel from './PmThreadsPanel';
import useCustomAppMaxWidth from 'src/hooks/useCustomAppMaxWidth';
import { setPageTitle } from 'src/utils/windowUtils';
import NewPmPanel from 'src/pages/pm/NewPmPanel';
import { EmptyPmMsgsPanel } from 'src/board/EmptyPanels';
import TopLogo from 'src/appshell/TopLogo';

export default function PmBoard() {
	useCustomAppMaxWidth('1280px');

	setPageTitle('Private Messages');

	return (
		<>
			<TopLogo />
			<div className="boardPanel pmBoardPanel">
				<Media queries={{ small: '(max-width: 991px)' }}>
					{matches => (
						<React.Fragment>
							{/*{(!matches.small || ['/pm', '/pm/'].includes(location.pathname)) && <PmThreadsPanel />}*/}
							<Routes>
								{!matches.small && <Route path=":threadId?" element={<PmThreadsPanel />} />}
							</Routes>

							<Routes>
								{matches.small && <Route path="" element={<PmThreadsPanel />} />}
								{!matches.small && <Route path="" element={<EmptyPmMsgsPanel />} />}
								<Route path="new" element={<NewPmPanel />} />
								<Route path=":threadId" element={<PmMsgsPanel />} />
							</Routes>
						</React.Fragment>
					)}
				</Media>
			</div>
		</>
	);
}
