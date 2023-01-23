import { useState, useEffect } from 'react';
import Board from './components/board';
import Button from './components/button';
import Modal from './components/modal';
import { v4 as uuidv4 } from 'uuid';
import { memoryImageType, TStatus } from './types';
import { COL_NUM, LS_RATIO_KEY, MEMORY_IMAGES, NEEDED_FOR_GAMEOVER, NEEDED_FOR_WIN, TOTAL_FIELDS } from './consts';

export interface IMemoryField extends memoryImageType {
    id: string;
}

interface IActiveFieldModel {
    countGood: number;
    countBad: number;
    status: TStatus;
}

type TScoreType = { win: number; lose: number };

const App = () => {
    const [memoryFields, setMemoryFields] = useState<IMemoryField[]>([]);
    const [activeField, setActiveField] = useState<IActiveFieldModel | null>(null);
    const [score, setScore] = useState<TScoreType>(JSON.parse(localStorage.getItem(LS_RATIO_KEY) || '[]'));
    const [surroundingArrayIndexes, setSurroundingArrayIndexes] = useState<number[]>([]);
    const [gameOverMsg, setGameOverMsg] = useState<string | undefined>(undefined);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [turns, setTurns] = useState<number>(0);

    const shuffleFields = (totalFields: number) => {
        setIsGameOver(false);
        setActiveField(null);
        const multiplier = totalFields / MEMORY_IMAGES.length;
        const initFieldsArr = [];
        for (let i = 0; i < multiplier; i++) {
            initFieldsArr.push(...MEMORY_IMAGES);
        }

        const shuffledFieldsArr = initFieldsArr
            .sort(() => Math.random() - 0.15)
            .map((item: memoryImageType) => ({ ...item, id: uuidv4() }));

        setMemoryFields(shuffledFieldsArr);
        setTurns(0);
    };

    const returnValueFromBoardField = (value: string, index: number) => {
        if (value === 'smile') {
            setActiveField({
                ...activeField,
                countGood: (activeField?.countGood || 0) + 1,
                countBad: activeField?.countBad || 0,
                status: (activeField?.countGood || 0) + 1 === NEEDED_FOR_WIN ? 'win' : 'ingame',
            });
        }

        if (value === 'bomb') {
            setActiveField({
                ...activeField,
                countGood: activeField?.countGood || 0,
                countBad: (activeField?.countBad || 0) + 1,
                status: (activeField?.countBad || 0) + 1 === NEEDED_FOR_GAMEOVER ? 'gameover' : 'ingame',
            });
        }

        if (value === 'resets') {
            setActiveField({
                ...activeField,
                countGood: 0,
                countBad: 0,
                status: 'ingame',
            });

            getSurroundingFieldsValues(index);
        }

        setTurns((prevTurns) => prevTurns + 1);
    };

    const handleStatus = (status: TStatus) => {
        const currentLSValue = JSON.parse(localStorage.getItem(LS_RATIO_KEY) || '[]');
        const newLSValue = {
            win: status === 'win' ? (currentLSValue?.win || 0) + 1 : currentLSValue?.win || 0,
            lose: status === 'gameover' ? (currentLSValue?.lose || 0) + 1 : currentLSValue?.lose || 0,
        };
        localStorage.setItem(LS_RATIO_KEY, JSON.stringify(newLSValue));
        setScore(newLSValue);

        switch (status) {
            case 'win':
                setGameOverMsg(`Congratulations, you won!! Let's do it again. :)`);
                setIsGameOver(true);
                setActiveField(null);
                break;
            case 'gameover':
                setGameOverMsg(`Oh snap, you lost. Let's go again!`);
                setIsGameOver(true);
                setActiveField(null);
            default:
                break;
        }
    };

    const getSurroundingFieldsValues = (n: number, col: number = COL_NUM) => {
        // -7-6-5
        // -1-n+1
        // +5+6+7

        // 1d array, maybe trough col and row
        setSurroundingArrayIndexes([
            n - col - 1,
            n - col,
            n - col + 1,
            n - 1,
            n + 1,
            n + col - 1,
            n + col,
            n + col + 1,
        ]);
    };

    // useEffect(() => {
    //     // save to redux - totalTries, winNumber, etc
    //     if (isGameOver) shuffleFields(TOTAL_FIELDS);
    // }, [isGameOver]);

    useEffect(() => {
        if (activeField?.status) handleStatus(activeField.status);
    }, [activeField?.status, memoryFields]);

    useEffect(() => {
        if (memoryFields.length !== 0) return;
        // do init shuffle
        shuffleFields(TOTAL_FIELDS);
    }, []);

    return (
        <div className="App">
            <main>
                <div className="container center flex-col">
                    <h1 className="title-with-span">
                        Let's play <span>Turn: {turns}</span>
                    </h1>

                    <div className="scores--wrapper">
                        <p>Wins: {score?.win || 0} </p>
                        <p>Losses: {score?.lose || 0} </p>
                    </div>
                    {/* maybe add loader */}
                    <Button title="Shuffle" className="primary" onClick={() => shuffleFields(TOTAL_FIELDS)} />

                    <Board.Grid>
                        {memoryFields.map((field: IMemoryField, index: number) => (
                            <Board.Item
                                key={field.id}
                                isOpen={surroundingArrayIndexes.includes(index) && field.name !== 'resets'}
                                onClickCallback={(value: string) => returnValueFromBoardField(value, index)}
                                {...field}
                            />
                        ))}
                    </Board.Grid>
                </div>

                <Modal
                    isOpen={isGameOver}
                    okButton="Start again"
                    onSuccessCallback={() => shuffleFields(TOTAL_FIELDS)}
                    handleClose={() => shuffleFields(TOTAL_FIELDS)}
                >
                    <p style={{ fontWeight: 600, fontSize: 20 }}>{gameOverMsg}</p>
                </Modal>
            </main>
        </div>
    );
};

export default App;
