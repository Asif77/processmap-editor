import * as types from '../actions/actionTypes';
//import initialState from './initialState';
import { IEditorContext } from '../interface/map';
import { mapObjectSelection } from '../components/constant';

const editor: IEditorContext = {
	nav: mapObjectSelection.Pointer,
	grid: 0,
	zoomFactor: 1
};

export default function navReducer(state: IEditorContext = editor, action: any) {
	switch (action.type) {
		case types.NAV_SELECTION_SUCCESS:
			return {
				...state,
				nav: action.payLoad.nav,
				grid: state.grid,
				zoomFactor: state.zoomFactor
			};
		case types.GRID_SELECTION_SUCCESS:
			return {
				...state,
				grid: action.payLoad.grid,
				nav: state.nav,
				zoomFactor: state.zoomFactor
			};
		default:
			return state;
	}
}
