import { DomTreeGlobalPopupBase, DomTreeGlobalPopupBaseProps, PopupsState } from '@atas/weblib-ui-js';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';

const mapStateToProps = (state: { popups: PopupsState }) => ({
	componentFn: state.popups.globalPopup.componentFn,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps;

export default connector(DomTreeGlobalPopupBase as React.ComponentType);
