//import { mapObjectSelection } from '../components/constant';
import { MapData, PlaybackHistory } from '../interface/map';

const map: MapData = {
	ProcessName: '',
	Steps: [],
	StepContexts: [],
	TextObjects: [],
	SwimColors: [],
	SwimPools: [],
	GroupObjects: [],
	SwimPoolHight: 0,
	Style: "{ backgroundColor: 'white' }",
	Height: 1600,
	Width: 1600
};

let playbackHistory: PlaybackHistory = {
	FrameRecords: [],
	SetRect: false,
	playbackHistorySuccess: false
};

export default {
	map: map,
	playbackHistory: playbackHistory,
	isLoading: true,
	hasErrored: false,
	errorMessage: ''
};
