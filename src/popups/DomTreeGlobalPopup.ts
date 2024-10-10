import { DomTreeGlobalPopupBase, DomTreeGlobalPopupBaseProps, PopupsState } from '@atas/webapp-ui-shared';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';

const mapStateToProps = (state: { popups: PopupsState }) => ({
	componentFn: state.popups.globalPopup.componentFn,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DomTreeGlobalPopupBase as React.ComponentType<DomTreeGlobalPopupBaseProps>);
