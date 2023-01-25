/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LS_LAST_ACTIVE_GAME, LS_RATIO_KEY, NEEDED_FOR_GAMEOVER, NEEDED_FOR_WIN } from '../../consts/index';

const currentLSValue = JSON.parse(localStorage.getItem(LS_RATIO_KEY) || '[]');

const lastGameInLS = JSON.parse(localStorage.getItem(LS_LAST_ACTIVE_GAME) || 'null');

const initialState: TGlobalState = {
  results: currentLSValue,
  activeField: lastGameInLS?.activeField || {
    countGood: 0,
    countBad: 0,
    status: null,
  },
  gameOverMessage: null,
  lastActiveGame: lastGameInLS,
};

export const globalsReducer = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setScore: (state, { payload }: PayloadAction<{ status: TStatus }>) => {
      const currentState = state.results;
      const newLSValue = {
        win: payload.status === 'win' ? (currentState?.win || 0) + 1 : currentState?.win || 0,
        lose: payload.status === 'gameover' ? (currentState?.lose || 0) + 1 : currentState?.lose || 0,
      };
      localStorage.setItem(LS_RATIO_KEY, JSON.stringify(newLSValue));

      state.results = newLSValue;
    },
    setGameOverMsg: (state, { payload }: PayloadAction<string>) => {
      state.gameOverMessage = payload;
    },
    setActiveField: (state, { payload }: PayloadAction<string | null>) => {
      if (payload === null) {
        state.activeField = null;
        return;
      }

      switch (payload) {
        case 'smile':
          state.activeField = {
            ...state.activeField,
            countGood: (state.activeField?.countGood || 0) + 1,
            countBad: state.activeField?.countBad || 0,
            status: (state.activeField?.countGood || 0) + 1 === NEEDED_FOR_WIN ? 'win' : 'ingame',
          };
          break;
        case 'bomb':
          state.activeField = {
            ...state.activeField,
            countGood: state.activeField?.countGood || 0,
            countBad: (state.activeField?.countBad || 0) + 1,
            status: (state.activeField?.countBad || 0) + 1 === NEEDED_FOR_GAMEOVER ? 'gameover' : 'ingame',
          };
          break;
        case 'resets':
          state.activeField = {
            ...state.activeField,
            countGood: 0,
            countBad: 0,
            status: 'ingame',
          };
          break;
        default:
          break;
      }
    },
    setLastActiveMemoryField: (state, { payload }: PayloadAction<IMemoryField[]>) => {
      state.lastActiveGame = {
        ...state.lastActiveGame,
        memoryFields: payload,
        openedFields: [],
      };
    },
    saveActiveGame: (state, { payload }: PayloadAction<{ index: number }>) => {
      if (state.activeField === null) {
        localStorage.setItem(LS_LAST_ACTIVE_GAME, JSON.stringify(null));
        return;
      }
      const ar = state?.lastActiveGame?.openedFields || [];
      ar.push(payload.index);

      const activeGameObj = {
        ...state.lastActiveGame,
        activeField: state.activeField,
        openedFields: ar,
      };
      state.lastActiveGame = activeGameObj;

      localStorage.setItem(LS_LAST_ACTIVE_GAME, JSON.stringify(activeGameObj));
    },
  },
});

export const { setScore, setGameOverMsg, setActiveField, saveActiveGame, setLastActiveMemoryField } = globalsReducer.actions;

export default globalsReducer.reducer;
