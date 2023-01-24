import { combineReducers } from '@reduxjs/toolkit';
import globalsReducer from './globals/globals.reducer';

const rootReducer = combineReducers({ globals: globalsReducer });

export default rootReducer;
