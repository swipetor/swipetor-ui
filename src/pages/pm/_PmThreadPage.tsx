// import React from 'react';
// import { connect } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
// import { MsgEntity, MsgThreadEntity, UserEntity } from 'src/types/Entities';
// import msgThreadActions from '../../actions/msgThreadActions';
// import { UIState } from '../../reducers/reducers';
// import detectBrowser from '../../utils/detectBrowser';
// import PmThreadLoading from './PmThreadLoading';

// interface IProps extends RouteComponentProps<{ threadId: string }> {
// 	thread?: MsgThreadEntity;
// 	msgs?: MsgEntity[];
// 	user?: UserEntity;
// 	loggedIn?: boolean | null;
// }

// interface IState {
// 	text: string;
// 	isMobile: boolean;
// }

// class MsgThreadPage extends React.Component<IProps, IState> {
// 	state: IState = {
// 		text: '',
// 		isMobile: detectBrowser.isMobile(),
// 	};

// 	componentDidMount() {
// 		const threadId = this.props.match.params.threadId;
// 		msgThreadActions.fetchMsgThread(parseInt(threadId));
// 		$('.footerBar').css('display', 'none');
// 	}

// 	componentWillUnmount(): void {
// 		$('.footerBar').css('display', '');
// 	}

// 	send = async () => {
// 		const threadId = this.props.match.params.threadId;
// 		await msgThreadActions.sendMsg(parseInt(threadId), this.state.text);
// 		this.setState({ ...this.state, text: '' });
// 	};

// 	getUserOther = () => {
// 		// return this.props.thread!.msgThreadUsers.map((u: any) => u.user).filter(u => u.id !== this.props.user!.id);
// 	};

// 	sentOrReceived = (msg: MsgEntity): 'sent' | 'received' => {
// 		return msg.senderUserId === this.props.user!.id ? 'sent' : 'received';
// 	};

// 	getUser = (userId: number) => {
// 		// return this.props.thread!.msgThreadUsers.filter(tu => tu.userId === userId).map(tu => tu.user)[0];
// 	};

// 	componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
// 		// If messages are loaded
// 		if (!prevProps.msgs && this.props.msgs) {
// 			this.markRead();
// 			this.scrollToBottom();
// 			setTimeout(this.scrollToBottom, 100);
// 		}

// 		// If there is a new msg, scroll to the bottom
// 		if (prevProps.msgs && this.props.msgs && prevProps.msgs.length < this.props.msgs.length) {
// 			this.markRead();
// 			this.scrollToBottom();
// 		}
// 	}

// 	async markRead() {
// 		// if (!this.props.thread || !this.props.user) return;
// 		// msgThreadActions.markRead(this.props.thread.id, this.props.user.id);
// 	}

// 	scrollToBottom() {
// 		$('html, body').animate({ scrollTop: $(document).height() }, 100);
// 	}

// 	onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		this.setState({ ...this.state, text: e.target.value });
// 	};

// 	onTextKeyUp = (e: React.KeyboardEvent) => {
// 		if (!this.state.isMobile && e.keyCode === 13) {
// 			this.send();
// 		}
// 	};

// 	render() {
// 		if (!this.props.user || !this.props.thread || !this.props.msgs) return <PmThreadLoading />;

// 		return (
// 			<div className="msgthreadContainer box">
// 				<h1>
// 					<ChatIcon /> &nbsp;
// 					{/* {this.getUserOther().map(u => (
// 						<span key={u.id}>{u.displayName},</span>
// 					))} */}
// 				</h1>

// 				<div className="msgsContainer">
// 					{this.props.msgs.map(m => (
// 						<div className={`msgContainer ${this.sentOrReceived(m)}`} key={m.id}>
// 							{/* <div className="user">{this.getUser(m.senderUserId).displayName}</div> */}
// 							<div className="msgRow">
// 								<div className="userPhoto">
// 									{/* <img
// 										src={photoUtils.getSrcByPhotoArr(this.getUser(m.senderUserId).photos, 64, true)}
// 									/> */}
// 								</div>
// 								<div className="msg">{m.txt}</div>
// 							</div>
// 							<div className="clear"></div>
// 						</div>
// 					))}
// 				</div>

// 				<div className="writeDivContainer">
// 					<div className="writeDiv">
// 						<div className="textbox">
// 							<TextField
// 								value={this.state.text}
// 								fullWidth
// 								onKeyUp={this.onTextKeyUp}
// 								onChange={this.onTextChange}
// 							/>
// 						</div>
// 						<div className="btn">
// 							<Button onClick={this.send}>Send</Button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// const mapStateToProps = (state: UIState) => ({
// 	user: state.my.user,
// 	loggedIn: state.my.loggedIn,
// 	msgs: state.msgThread.msgs,
// 	thread: state.msgThread.thread,
// });

// export default connect(mapStateToProps)(MsgThreadPage);
