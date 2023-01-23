import React from 'react';
import './index.scss';

interface IButtonProps {
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | undefined;
    className?: string;
    onClick?: (e?: React.SyntheticEvent) => void;
    title?: string;
    isLoading?: boolean;
    disabled?: boolean;
}
const Button = ({
    type = 'button',
    children,
    className,
    onClick,
    title,
    isLoading = false,
    disabled = false,
}: IButtonProps) => {
    return (
        <button
            className={`${className || ''} ${isLoading ? 'button--loading' : ''}`}
            type={type}
            title={title}
            onClick={onClick}
            disabled={isLoading ? true : false || disabled}
        >
            {children} {title}
        </button>
    );
};
export default Button;
