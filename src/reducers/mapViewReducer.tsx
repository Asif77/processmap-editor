import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { Step, Data, FrameRecord } from '../interface/map';

export interface MapState {
	data: Data;
}

export default function mapReducer(state: any = initialState, action: any) {
	switch (action.type) {
		case types.LOAD_MAP_SUCCESS:
			return action.map;
		case types.LOAD_PROCESS_MAP_SUCCESS:
			return {
				...state,
				map: action.map,
				isLoading: false,
				hasErrored: false
			};
		case types.LOAD_PROCESS_MAP_FAILED:
			return {
				...state,
				map: initialState.map,
				errorMessage: action.error,
				isLoading: false,
				hasErrored: true
			};
		case types.LOAD_PLAYBACK_HISTORY_SUCCESS:
			return {
				...state,
				playbackHistory: {
					FrameRecords: action.playbackHistory,
					SetRect: false,
					playbackHistorySuccess: true
				},
				isLoading: false,
				hasErrored: false
			};
		case types.LOAD_PLAYBACK_HISTORY_FAILED:
			return {
				...state,
				playbackHistory: initialState.playbackHistory,
				errorMessage: action.error,
				isLoading: false,
				hasErrored: false
			};
		case types.UPDATE_PLAYBACK_HISTORY:
			return {
				...state,
				playbackHistory: {
					...state.playbackHistory,
					FrameRecords: [
						...state.playbackHistory.FrameRecords.map((f: FrameRecord, i: number) => {
							return f.ID === action.frameRecord.ID ? action.frameRecord : f;
						})
					]
				}
			};
		case types.UPDATE_PLAYBACK_HISTORY_SETASSOCIATERECT:
			return {
				...state,
				playbackHistory: {
					...state.playbackHistory,
					SetRect: true
				}
			};
		case types.UPDATE_MAP_SUCCESS:
			return {
				...state,
				map: {
					...state.map,
					Steps: [
						...state.map.Steps.map((s: Step, i: number) => {
							return s.Name === action.step.Name ? action.step : s;
						})
					]
				}
			};
		case types.UPDATE_STEP_SUCCESS:
			return {
				...state,
				map: {
					...state.map,
					Steps: [
						...state.map.Steps.map((s: Step, i: number) => {
							return s.Name === action.step.Name ? action.step : s;
						})
					]
				}
			};
		case types.ADD_STEP_SUCCESS:
			return {
				...state,
				map: {
					...state.map,
					Steps: [ ...state.map.Steps, action.step ]
				}
			};
		default:
			return state;
	}
}
