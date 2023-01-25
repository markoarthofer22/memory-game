import { combineReducers } from '@reduxjs/toolkit';
import { globalsReducer } from './globals/globals.reducer';

const rootReducer = combineReducers({ globals: globalsReducer.reducer });

export default rootReducer;
