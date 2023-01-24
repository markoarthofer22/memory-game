import React, { useEffect } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import Button from '../button';
import './index.scss';

interface IModalProps {
    isOpen: boolean;
    handleClose: (close: boolean) => void;
    children: React.ReactNode;
    title?: string;
    okButton?: string;
    onSuccessCallback: () => void;
}

const Modal = ({ isOpen, handleClose, children, title, okButton = 'OK', onSuccessCallback }: IModalProps) => {
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.position = 'fixed';

        //dispatch(setCanScroll(false));

        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';

            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="popup">
            <div className="popup--window">
                {title && <h2 className="popup--title">{title}</h2>}
                <div>{children}</div>
                <Button title={okButton} className="purple" onClick={onSuccessCallback} />
                {handleClose && (
                    <div onClick={() => handleClose(false)} className="popup--close">
                        <VscChromeClose />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
