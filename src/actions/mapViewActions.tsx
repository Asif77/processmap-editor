import * as types from './actionTypes';
import mapApi from '../api/mapApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import { MapData, Step, FrameRecord } from '../interface/map';

export function loadMapSuccess(map: MapData) {
	return { type: types.LOAD_MAP_SUCCESS, map };
}

export function loadProcessMapSuccess(map: MapData) {
	return { type: types.LOAD_PROCESS_MAP_SUCCESS, map };
}

export function loadProcessMapFailed(error: string) {
	return { type: types.LOAD_PROCESS_MAP_FAILED, error };
}

export function loadPlaybackHistorySuccess(playbackHistory: any) {
	return { type: types.LOAD_PLAYBACK_HISTORY_SUCCESS, playbackHistory };
}

export function loadPlaybackHistoryFailed(error: string) {
	return { type: types.LOAD_PLAYBACK_HISTORY_FAILED, error };
}

export function updatePlaybackHistorySuccess(frameRecord: FrameRecord) {
	return { type: types.UPDATE_PLAYBACK_HISTORY, frameRecord };
}

export function updatePlaybackHistorySetAssociateRectSuccess() {
	return { type: types.UPDATE_PLAYBACK_HISTORY_SETASSOCIATERECT };
}

export function updateMapSuccess(step: Step) {
	return { type: types.UPDATE_MAP_SUCCESS, step };
}

export function updateStepSuccess(step: Step) {
	return { type: types.UPDATE_STEP_SUCCESS, step };
}

export function addStepSuccess(step: Step) {
	return { type: types.ADD_STEP_SUCCESS, step };
}

export function saveMapSuccess(result: any) {
	return { type: types.SAVE_MAP_SUCCESS, result };
}

export function loadMap() {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return mapApi
			.getMap()
			.then((map: any) => {
				dispatch(loadMapSuccess(map));
			})
			.catch((error) => {
				dispatch(ajaxCallError());
				throw error;
			});
	};
}

export function loadProcessMap(server: string, processName: string, version: number, incident: number) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return mapApi
			.getProcessMap(server, processName, version, incident)
			.then((result: any) => {
				if (result.Status === 1) dispatch(loadProcessMapSuccess(result.Data));
				else dispatch(loadProcessMapFailed(result.Message));
			})
			.catch((error) => {
				dispatch(loadProcessMapFailed('Error loading process map..'));
				//dispatch(ajaxCallError());
				//throw error;
			});
	};
}

export function loadPlaybackHistory(server: string, processName: string, version: number, incident: number) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return mapApi
			.loadPlaybackHistory(server, processName, version, incident)
			.then((result: any) => {
				if (result.Status === 1) dispatch(loadPlaybackHistorySuccess(result.Data));
				else dispatch(loadPlaybackHistoryFailed(result.Message));
			})
			.catch((error) => {
				dispatch(loadPlaybackHistoryFailed('Error loading playback history..'));
			});
	};
}

export function loadLocalizedDataSuccess(data: any) {
	return { type: types.LOAD_LOCALIZED_DATA_SUCCESS, payLoad: { data: data } };
}

export function loadLocalizedDataFailed(error: string) {
	return { type: types.LOAD_LOCALIZED_DATA_FAILED, payLoad: { error: error } };
}

export function loadLocalizedData(server: string, serverId: string, processName: string, language: string) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return mapApi
			.getLocalizedData(server, serverId, processName, language)
			.then((result: any) => {
				//if (result.Status === 1)
				dispatch(loadLocalizedDataSuccess(result));
				//else
				//dispatch(loadLocalizedDataFailed(result.Message));
			})
			.catch((error) => {
				dispatch(loadLocalizedDataFailed(error));
				//throw error;
			});
	};
}

export function updatePlaybackHistory(frameRecord: FrameRecord) {
	return function(dispatch: any) {
		return dispatch(updatePlaybackHistorySuccess(frameRecord));
	};
}

export function updatePlaybackHistorySetAssociateRect() {
	return function(dispatch: any) {
		return dispatch(updatePlaybackHistorySetAssociateRect());
	};
}

export function updateMap(step: Step) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return dispatch(updateMapSuccess(step));
	};
}

export function updateStep(step: Step) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return dispatch(updateStepSuccess(step));
	};
}

export function addStep(step: Step) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return dispatch(addStepSuccess(step));
	};
}

export function saveMap(map: MapData) {
	return function(dispatch: any) {
		dispatch(beginAjaxCall());
		return mapApi
			.saveProcessMap(map)
			.then((result) => {
				dispatch(saveMapSuccess(result));
			})
			.catch((error) => {
				dispatch(ajaxCallError());
				throw error;
			});
	};
}
