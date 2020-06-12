import * as types from './actionTypes';

export function navSelectionSuccess(sel: number) {
	return { type: types.NAV_SELECTION_SUCCESS, payLoad: { nav: sel } };
}

export function navSelection(sel: number) {
	return function(dispatch: any) {
		dispatch(navSelectionSuccess(sel));
	};
}

export function gridSelectionSuccess(sel: number) {
	return { type: types.GRID_SELECTION_SUCCESS, payLoad: { grid: sel } };
}

export function gridSelection(sel: number) {
	return function(dispatch: any) {
		dispatch(gridSelectionSuccess(sel));
	};
}
