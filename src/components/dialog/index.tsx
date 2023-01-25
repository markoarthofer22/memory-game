import React, { useContext, useEffect } from 'react';
import DialogContext from '../../context/dialog/dialog.context';
import Button from '../button';

import './index.scss';

const Dialog = () => {
  const { dialog, setDialog } = useContext(DialogContext);

  useEffect(() => {
    if (!dialog.autoClose) return undefined;

    const timeout = setTimeout(() => {
      setDialog({ ...dialog, isOpen: false });
    }, dialog.autoClose);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.autoClose]);

  return (
    <>
      {dialog.isOpen && (
        <div className="dialogOuter">
          <div className={`dialog ${dialog.centerDialog ? 'centered-dialog' : ''}`}>
            <h1 className="title">{dialog?.title}</h1>

            {dialog?.text && <div className="message">{dialog?.text}</div>}

            <div className="actions">
              {dialog.handleConfirm && (
                <Button isLoading={dialog.isLoading} className="confirm" title={dialog.confirmText} onClick={dialog.handleConfirm} />
              )}

              {dialog.handleCancel && (
                <Button disabled={dialog.isLoading} className="cancel" title={dialog.cancelText} onClick={dialog.handleCancel} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dialog;
