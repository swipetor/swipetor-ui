import React, { forwardRef, TextareaHTMLAttributes, useImperativeHandle, useRef } from 'react';

// Define the props type to extend all standard textarea HTML attributes
type AutoResizingTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const AutoResizingTextarea = forwardRef<HTMLTextAreaElement, AutoResizingTextareaProps>((props, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const target = e.target;
		target.style.height = 'auto'; // Reset the height so the calculation is correct
		target.style.height = `${target.scrollHeight + 24}px`; // Set the height based on the content

		// Call the original onChange handler if one was provided
		props.onChange?.(e);
	};

	return (
		<textarea
			{...props} // Spread all other props to the textarea element
			ref={textareaRef}
			onInput={handleInput} // Handle input to adjust size
			style={{
				...props.style,
				overflow: 'hidden',
				resize: 'none', // Typically we disable resizing since it's auto-resizing
			}}
		/>
	);
});

AutoResizingTextarea.displayName = 'AutoResizingTextarea';

export default AutoResizingTextarea;
