import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

interface Props {
	btnValue: React.ReactNode;
	rightAlign?: boolean;
	children: React.ReactNode;
}

export default function Menu({ btnValue, rightAlign, children }: Props) {
	const [show, setShow] = useState(false);

	const menuClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		!show ? openClick() : closeClick();
	};

	const openClick = () => {
		setShow(true);
		document.body.addEventListener('click', bodyClick);
	};

	const closeClick = () => {
		setShow(false);
		document.body.removeEventListener('click', bodyClick);
	};

	const bodyClick = useCallback((event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const isMenuButton = target.matches('.menuBtn') || target.parentElement?.matches('.menuBtn');

		if (!isMenuButton) {
			setShow(false);
			document.body.removeEventListener('click', bodyClick);

			const dropdowns = document.getElementsByClassName('dropdown-content');
			for (let i = 0; i < dropdowns.length; i++) {
				const openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
					openDropdown.classList.remove('show');
				}
			}
		}
	}, []);

	useEffect(() => {
		return () => {
			document.body.removeEventListener('click', bodyClick);
		};
	}, [bodyClick]);

	const getContentDivClass = () => {
		const cls = ['dropdown-content'];
		if (rightAlign) cls.push('rightAlign');
		return cls.join(' ');
	};

	return (
		<span className={`dropdown ${rightAlign ? 'rightAlign' : ''}`}>
			<button onClick={menuClick} className="menuBtn">
				{btnValue}
			</button>

			<CSSTransition in={show} timeout={300} unmountOnExit>
				<React.Fragment>
					<div className={getContentDivClass()}>{children}</div>
					{/* Content background is used to make menu close on clicking outside.*/}
					<div className="dropdownContentBg"></div>
				</React.Fragment>
			</CSSTransition>
		</span>
	);
}

/*
Example usage

export default function TopBarMenu() {
	return (
		<Menu
			rightAlign
			btnValue={
				<React.Fragment>
					{props.isLoggedIn && (
						<UploadedPhoto isUserPhoto size={64} photo={props.user?.photo} className="userPhoto" />
					)}
					<span className="material-icons-outlined">more_vert</span>
				</React.Fragment>
			}>
			<React.Fragment>
				<DelayedLink to={`/my`}>My account</DelayedLink>

				<a href="/admin" target="_blank" className="btn block">
					Admin Panel
				</a>

				<a href="/pages/privacy" target="_blank">
					Privacy Policy
				</a>

			</React.Fragment>
		</Menu>
	);
}
*/
