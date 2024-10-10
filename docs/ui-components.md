# swipetor-ui Components

## Style classes

```
DelayedButton.main.(.red|.grey|.white)
DelayedLink.mainBtn.(.red|.grey|.white)

a.btn
label.btn
```

### Centered Box

```typescript jsx
<div className="box centeredPage"></div>
```

## Simple Components

### Uploaded Photo

```typescript jsx
<UploadedPhoto isUserPhoto size={64} photo={obj.photo} />
```

### Map State To Props

```typescript jsx
const mapStateToProps = (state: UIState, props: IProps) => {
	return {
		postsById: state.post.postsById,
	};
};

export default connect(mapStateToProps)(ComponentName);
```

### Map State To Props with Connector

```typescript jsx
interface Props {
	someProps: boolean;
}

class MyComponent extends React.Component<MergedProps, State> {
...
}

const mapStateToProps = (state: UIState) => ({
	user: state.my.user,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type MergedProps = Props & PropsFromRedux;

export default connector(MyComponent);
```

## Popups

### Sliding Popup

```typescript jsx
popupActions.slidingPopup();
```

### Extending PopupBase

```typescript jsx
export default class CustomPopup extends PopupBase<Props, {}> {
	title = 'My Title';

	okayBtnClick() {
		this.props.closeDialogFn();
	}

	renderContent() {
		return <div style={{ minWidth: 300 }}></div>;
	}
}

<CustomPopup closeDialogFn={() => this.setState({ ...this.state, show: false })} isOpen={this.state.show} />;
```

### Fullscreen Popup

Open:

```typescript jsx
popupActions.fullScreenPopup({
	child: <SomeComponent />,
	title: 'Title',
	isOpen: true,
});
```

Close

```typescript jsx
popupActions.fullScreenPopup({ isOpen: false });
```

### Popup Message

```typescript jsx
popupActions.popupMsg({
	title: 'Remove post?',
	content: (
		<div>
			Post below will be removed.
			{/* <br /> <i>{shortenString(this.props.post.txt, 60)}</i> */}
		</div>
	),
	okayBtn: 'Remove',
	okayBtnClick: async () => this.removePostExecute(true),
});
```

### Snackbar Msg

```typescript jsx
popupActions.snackbarMsg('Message', SimpleSnackbarVariant.success);
```

## HTML Fields

### Text field

```typescript jsx
<label className="matter-textfield-filled block">
	<input
		type="text"
		placeholder=" "
		value={this.state.field}
		onChange={e => this.setState({ ...this.state, field: e.target.value })}
	/>
	<span>Field name</span>
</label>
```

### Textarea

```typescript jsx
<label className="matter-textfield-filled block">
    <textarea
		value={this.state.textarea || ''}
		placeholder=" "
		onChange={e => this.setState({ ...this.state, textarea: e.target.value })}
	/>
	<span>Textarea name</span>
</label>
<span className="helperText">More explanation</span>
```

### Checkbox

```typescript jsx
<label className="matter-checkbox">
	<input
		type="checkbox"
		checked={this.state.cb}
		onChange={e => this.setState({ ...this.state, cb: e.target.checked })}
	/>
	<span>Checkbox name</span>
</label>
```

## Photo Upload

```typescript jsx
interface State {
	photoUploadContext: PhotoUploadContext;
}

render();
{
	return (
		<React.Fragment>
			<PhotoUploadSelect name="Change Photo" context={this.state.photoUploadContext} />
			<PhotoUploadPreviews context={this.state.photoUploadContext} />

			{this.state.photoUploadContext.files.length > 0 && (
				<button onClick={this.uploadClick} className="main grey">
					Upload
				</button>
			)}
		</React.Fragment>
	);
}
```

## Links

### Global SPA Alert Dialogs by URL

```
https://local.swipetor.com:8443/login?msgCode=userActivated
```

This will popup an alert dialog on top of the page below the TopBar.
![Alert Dialog by MsgCode](./_docs/AlertDialogMsgCode.jpg 'Alert Dialog by MsgCode')
