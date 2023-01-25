import React, { useState, useEffect, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Board from './components/board';
import Button from './components/button';
import { MEMORY_IMAGES, TOTAL_FIELDS } from './consts';
import { useAppDispatch, useAppSelector } from './hooks/useReduxStore';
import Dialog from './components/dialog';
import DialogContext from './context/dialog/dialog.context';
import { setScore, setGameOverMsg, setActiveField, saveActiveGame, setLastActiveMemoryField } from './store/globals/globals.reducer';

const App = () => {
  const score = useAppSelector((state) => state.globals.results);
  const gameOverMsg = useAppSelector((state) => state.globals.gameOverMessage);
  const activeField = useAppSelector((state) => state.globals.activeField);
  const game = useAppSelector((state) => state.globals.lastActiveGame);

  const [memoryFields, setMemoryFields] = useState<IMemoryField[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [turns, setTurns] = useState<number>(game?.openedFields.length || 0);
  const { dialog, setDialog } = useContext(DialogContext);
  const dispatch = useAppDispatch();

  const shuffleFields = useCallback(
    (totalFields: number) => {
      setIsGameOver(false);
      dispatch(setActiveField(null));

      const multiplier = totalFields / MEMORY_IMAGES.length;
      const initFieldsArr = [];
      for (let i = 0; i < multiplier; i++) {
        initFieldsArr.push(...MEMORY_IMAGES);
      }

      const shuffledFieldsArr = initFieldsArr.sort(() => Math.random() - 0.15).map((item: memoryImageType) => ({ ...item, id: uuidv4() }));

      setMemoryFields(shuffledFieldsArr);
      dispatch(setLastActiveMemoryField(shuffledFieldsArr));
      setTurns(0);
    },
    [dispatch]
  );

  const returnValueFromBoardField = async (value: string, index: number) => {
    await dispatch(setActiveField(value));
    dispatch(saveActiveGame({ index }));
    setTurns((prevTurns) => prevTurns + 1);
  };

  const handleStatus = useCallback(
    (status: TStatus) => {
      dispatch(setScore({ status }));

      switch (status) {
        case 'win':
          dispatch(setGameOverMsg(`Congratulations, you won!! Let's do it again. :)`));
          dispatch(setActiveField(null));
          setIsGameOver(true);

          break;
        case 'gameover':
          dispatch(setGameOverMsg(`Oh snap, you lost. Let's go again!`));
          dispatch(setActiveField(null));
          setIsGameOver(true);
          break;
        default:
          break;
      }
    },
    [dispatch]
  );

  // const getSurroundingFieldsValues = (n: number, col: number = COL_NUM) => {
  //     // -7-6-5
  //     // -1-n+1
  //     // +5+6+7

  //     // 1d array, maybe trough col and row
  //     setSurroundingArrayIndexes([
  //         n - col - 1,
  //         n - col,
  //         n - col + 1,
  //         n - 1,
  //         n + 1,
  //         n + col - 1,
  //         n + col,
  //         n + col + 1,
  //     ]);
  // };

  useEffect(() => {
    if (isGameOver) {
      setDialog({
        isOpen: true,
        text: gameOverMsg!,
        title: 'Hello there',
        handleConfirm: async () => {
          setDialog({ ...dialog, isOpen: false });
          shuffleFields(TOTAL_FIELDS);
        },
        centerDialog: true,
        confirmText: 'Done',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  useEffect(() => {
    if (activeField?.status) handleStatus(activeField.status);
  }, [activeField?.status, handleStatus, memoryFields]);

  useEffect(() => {
    if (game?.memoryFields && game?.memoryFields?.length > 0) {
      setMemoryFields(game?.memoryFields);
    } else shuffleFields(TOTAL_FIELDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <main>
        <div className="container center flex-col">
          <h1 className="title-with-span">
            Let&#39;s play <span>Turn: {turns}</span>
          </h1>

          <div className="scores--wrapper">
            <p>Wins: {score?.win || 0} </p>
            <p>Losses: {score?.lose || 0} </p>
          </div>
          {/* maybe add loader */}
          <Button title="Shuffle" className="purple" onClick={() => shuffleFields(TOTAL_FIELDS)} />

          <Board.Grid>
            {memoryFields.map((field: IMemoryField, index: number) => (
              <Board.Item
                key={field.id}
                // isOpen={surroundingArrayIndexes.includes(index) && field.name !== 'resets'}
                isOpen={game?.openedFields?.includes(index)}
                onClickCallback={(value: string) => returnValueFromBoardField(value, index)}
                {...field}
              />
            ))}
          </Board.Grid>
        </div>

        <Dialog />
      </main>
    </div>
  );
};

export default App;
