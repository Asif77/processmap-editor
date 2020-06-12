import { combineReducers } from 'redux';
import data from './mapViewReducer';
import editorContext from './editorReducer';
import localizedData from './localizedReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';

const rootReducer = combineReducers({
	data,
	editorContext,
	localizedData,
	ajaxCallsInProgress
});

export default rootReducer;
