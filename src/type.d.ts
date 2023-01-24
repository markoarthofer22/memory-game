// TYPES
type memoryImageType = {
    img: '💥' | '🌀' | '😃';
    name: 'bomb' | 'resets' | 'smile';
};

type TStatus = 'win' | 'gameover' | 'ingame' | null;

type TScoreType = { win: number; lose: number };

type TGlobalState = {
    results: TScoreType;
    activeField: IActiveFieldModel | null;
    gameOverMessage: string | null;
    lastActiveGame: {
        memoryFields?: IMemoryField[] | null;
        activeField?: IActiveFieldModel | null;
        openedFields: number[];
    } | null;
};

type TDialogValues = {
    isOpen: boolean;
    text?: string;
    title?: string;
    handleConfirm?: (value: unknown) => void;
    handleCancel?: (value: unknown) => void;
    cancelText?: string;
    confirmText?: string;
    centerDialog?: boolean;
    isLoading?: boolean;
    autoClose?: number | false;
};

type TDialogProps = {
    dialog: TDialogValues;
    setDialog: React.Dispatch<React.SetStateAction<TDialogValues>>;
};

// INTERFACES
interface IMemoryField extends memoryImageType {
    id: string;
}

interface IActiveFieldModel {
    countGood: number;
    countBad: number;
    status: TStatus;
}
