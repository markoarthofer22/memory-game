import React, { useState } from 'react';
import DialogContext from './dialog.context';

interface IDialogProvider {
  children: React.ReactNode;
}

const DialogProvider = ({ children, ...props }: IDialogProvider) => {
  // Dialog global state
  const [dialog, setDialog] = useState<TDialogValues>({
    isOpen: false,
    text: undefined,
    title: undefined,
    handleConfirm: undefined,
    handleCancel: undefined,
    cancelText: 'Close',
    confirmText: 'Ok',
    centerDialog: true,
    isLoading: false,
    autoClose: false,
  });

  return (
    <DialogContext.Provider value={{ dialog, setDialog }} {...props}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
