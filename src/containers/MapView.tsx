import * as React from 'react';
//import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import bindme from 'bindme';

import * as mapActions from '../actions/mapViewActions';
import * as navActions from '../actions/navActions';

import { MapData, IParam, Step, PlaybackHistory, BpmLocale, Anchor, Link, IEditorContext } from '../interface/map';
import * as ImageConst from '../components/imageConst';
import Map from '../components/Map';
import './MapView.css';
import PropsPage from '../components/PropsPage';
import { mapObjectSelection } from '../components/constant';
import SpeedDials from '../components/SpeedDials';
import { rect } from '../utils/global';
//import { Height } from '@material-ui/icons';

class MapView extends React.Component<IMapViewProps, IMapViewState> {
	constructor(props: IMapViewProps) {
		super(props);

		bindme(
			this,
			'onDocumentKeydown',
			'onDocumentKeyup',
			'onMouseDown',
			'onMouseEnter',
			'onMouseLeave',
			'onMouseMove',
			'onMouseUp',
			'onWindowResize',
			'onWindowScroll',
			'selectStep',
			'stopDragging',
			'showStepProps',
			'onWheel'
		);

		this.state = {
			dragging: null,
			isMouseDown: false,
			isMouseMoving: false,
			isMouseOver: true,
			offset: { x: 0, y: 0 },
			scroll: { x: 0, y: 0 },
			selected: {},
			shiftPressed: false,
			toolbarHeight: props.params.editable ? 64 : 0,
			sourcestep: {},
			destinationstep: {},
			stepPropsShown: false,
			step: {},
			size: this.getBrowserSize(),
			actions: {
				mapActions: {},
				navActions: {}
			},
			playback: false,
			pause: false,
			frameIndex: 0,
			enableNextBtn: true,
			enablePrevBtn: false,
			timeoutId: '',
			mapSelection: {
				x: 9999,
				y: 9999,
				height: 0,
				width: 0
			}
		};
	}

	loadMap = () => {
		const { protocol, hostName, processName, version, incident, bpmServer, serverId, language } = this.props.params;

		if (processName) {
			this.props.actions.mapActions.loadProcessMap(bpmServer, processName, version, incident);

			this.props.actions.mapActions.loadLocalizedData(
				`${protocol}//${hostName}`,
				serverId,
				processName,
				language
			);
		}
	};

	componentDidMount() {
		this.loadMap();

		const { editable } = this.props.params;
		const height = editable ? 64 : 0;
		//let header = document.getElementById('header');
		//const height = header ? header.clientHeight : 0;

		let node: Node | null = ReactDOM.findDOMNode(this);

		if (node === null) return;

		let container: any = node.parentNode;

		document.addEventListener('keydown', this.onDocumentKeydown);
		document.addEventListener('keyup', this.onDocumentKeyup);

		window.addEventListener('scroll', this.onWindowScroll);
		window.addEventListener('resize', this.onWindowResize(container));
		window.addEventListener('wheel', this.onWheel);

		const offset = {
			x: container.offsetLeft,
			y: container.offsetTop
		};

		const scroll = {
			x: window.scrollX,
			y: window.scrollY
		};

		this.setState({
			offset,
			scroll,
			toolbarHeight: height
		});

		this.setState({ size: this.getBrowserSize() });
	}

	startPlayback = () => {
		const { playbackHistory } = this.props;

		if (!playbackHistory.playbackHistorySuccess) {
			const { processName, version, incident, bpmServer } = this.props.params;
			this.props.actions.mapActions.loadPlaybackHistory(bpmServer, processName, version, incident);
		} else {
			this.startPlaybackTimer();
		}

		this.setState({
			playback: true,
			frameIndex: 0,
			enableNextBtn: true,
			enablePrevBtn: false,
			pause: false
		});
	};

	stopPlayback = () => {
		this.stopPlaybackTimer();

		this.setState({
			playback: false,
			frameIndex: 0,
			enableNextBtn: true,
			enablePrevBtn: false,
			pause: false
		});
	};

	pausePlayback = () => {
		const { pause } = this.state;

		if (pause) this.startPlaybackTimer();
		else this.stopPlaybackTimer();

		this.setState({ pause: !pause });
	};

	nextPlayback = () => {
		const { frameIndex } = this.state;
		const { FrameRecords } = this.props.playbackHistory;

		let currentIndex = frameIndex + 1;

		this.stopPlaybackTimer();

		this.setState({
			frameIndex: currentIndex,
			enableNextBtn: currentIndex < FrameRecords.length,
			enablePrevBtn: currentIndex > 0,
			pause: true
		});
	};

	prevPlayback = () => {
		const { frameIndex } = this.state;
		const { FrameRecords } = this.props.playbackHistory;

		let currentIndex = frameIndex - 1;

		this.stopPlaybackTimer();

		this.setState({
			frameIndex: currentIndex,
			enableNextBtn: currentIndex < FrameRecords.length,
			enablePrevBtn: currentIndex > 0,
			pause: true
		});
	};

	timer = () => {
		const { frameIndex } = this.state;
		const { FrameRecords } = this.props.playbackHistory;

		if (frameIndex < FrameRecords.length) {
			let currentIndex = frameIndex + 1;
			this.setState({
				frameIndex: currentIndex,
				enableNextBtn: currentIndex < FrameRecords.length,
				enablePrevBtn: currentIndex > 0
			});
		} else {
			//string Message = string.Format(global:: Ultimus.ProcessAdmin.Properties.UltResUltProcessAdmin.PlayBackCompletedMessage, HelperClass.QUOTES(m_ProcessName), m_Incident.ToString());
			//ShowMessageWindow(false, Message);
			this.stopPlayback();
		}
	};

	stopPlaybackTimer = () => {
		const { timeoutId } = this.state;
		clearInterval(timeoutId);
	};

	startPlaybackTimer = () => {
		const timeoutId = setInterval(() => {
			this.timer();
		}, 2000);

		setTimeout(() => this.setState({ timeoutId: timeoutId }), 0);
	};

	getDrawLink = () => {
		const { nav } = this.props.editorContext;
		return nav === mapObjectSelection.Link ? true : false;
	};

	createArrow = (event: any) => {
		event.stopPropagation();
	};

	getCoordinates = (e: any) => {
		//const { scroll } = this.state;
		const svg = document.getElementById('map');

		return {
			x: e.pageX - svg.offsetLeft, // + scroll.x,
			y: e.pageY - svg.offsetTop // + scroll.y
		};
	};

	isInside = (coordinates: any) => {
		const { mapSelection } = this.state;

		return (
			coordinates.x >= mapSelection.x &&
			coordinates.x <= mapSelection.x + mapSelection.width &&
			coordinates.y >= mapSelection.y &&
			coordinates.y <= mapSelection.y + mapSelection.height
		);
	};

	setSelection = () => {
		const { map } = this.props;
		const steps = [ ...map.Steps ];
		let selectedStep = {};
		steps.forEach((step) => {
			let s = JSON.parse(JSON.stringify(step));
			if (this.isInside({ x: s.Location.X, y: s.Location.Y })) {
				selectedStep = Object.assign({}, selectedStep);
				selectedStep[s.Id] = true;
			}
		});

		this.setState({
			selected: selectedStep
		});
	};

	onDocumentKeydown = (event: any) => {
		const { code } = event;

		switch (code) {
			case 'Escape':
				this.setState({ selected: {} });
				break;

			case 'ShiftLeft':
			case 'ShiftRight':
				this.setState({ shiftPressed: true });
				break;

			case 'Delete':
				break;

			default:
				break;
		}
	};

	onDocumentKeyup = (event: any) => {
		const { code } = event;

		switch (code) {
			case 'ShiftLeft':
			case 'ShiftRight':
				this.setState({ shiftPressed: false });
				break;

			default:
				break;
		}
	};

	calcDocSize = () => {
		const { map } = this.props;
		let docRect = new rect(0, 0, 0, 0);
		map.Steps.forEach((step: Step) => {
			const { Location } = step;
			docRect = docRect.union(Location.X, Location.Y, 64, 64);
		});

		map.TextObjects.forEach((textObject: any, i: any) => {
			const { Location } = textObject;
			docRect = docRect.union(Location.X, Location.Y, 20, 20);
		});

		if (map.SwimColors.length > 0) {
			let height = map.SwimColors.length * (ImageConst.SWIMCOLORSIZE + ImageConst.SWIMCOLORSGAP);
			let width = map.SwimColors[0].Name.length;
			for (let i = 1; i < map.SwimColors.length; i++) {
				if (map.SwimColors[i].Name.length > width) width = map.SwimColors[i].Name.length;
			}

			map.SwimPools.forEach((swimPool: any, i: number) => {
				const { Location } = swimPool;
				docRect = docRect.union(Location.X, Location.Y, width, height);
			});
		}

		console.log(docRect);
		/*
		pos = m_GroupsObjects.GetHeadPosition();
		CGroupObject * pgroup = NULL;
		while (pos) {
			pgroup = (CGroupObject *)m_GroupsObjects.GetNext(pos);
			docRect.UnionRect(docRect, pgroup -> m_rect);
		}
		return m_DocSize = CSize(docRect.right + 250, docRect.bottom + 250);*/
	};

	getBrowserSize = () => {
		var myWidth = 0,
			myHeight = 0;
		if (typeof window.innerWidth === 'number') {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if (
			document.documentElement &&
			(document.documentElement.clientWidth || document.documentElement.clientHeight)
		) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}

		const { editable } = this.props.params;

		let size = {
			height: editable ? myHeight - 64 : myHeight,
			width: myWidth
		};

		this.calcDocSize();

		return size;
	};

	onMouseDown = (e: any) => {
		const { nav } = this.props.editorContext;
		const coordinates = this.getCoordinates(e);
		if (!this.isInside(coordinates)) {
			this.setState({
				isMouseDown: true,
				mapSelection: {
					x: coordinates.x,
					y: coordinates.y,
					height: 0,
					width: 0
				},
				selected: {}
			});
		} else {
			this.setState({
				isMouseDown: true
			});
		}

		if (nav === mapObjectSelection.User) {
			const id = Math.floor(Math.random() * 1000000);
			let user = {
				$type: 'Ultimus.ProcessMap.UserStep, Ultimus.ProcessMap',
				StepTypeName: 'User',
				Id: id,
				Name: id,
				Links: [],
				Location: {
					X: coordinates.x,
					Y: coordinates.y
				}
			};

			this.setDefaultMapObjectSelection();
			this.props.actions.mapActions.addStep(user);
		}

		if (nav === mapObjectSelection.Junction) {
			const id = Math.floor(Math.random() * 1000000);
			let junction = {
				$type: 'Ultimus.ProcessMap.JunctionStep, Ultimus.ProcessMap',
				StepTypeName: 'Junction',
				Id: id,
				Name: id,
				Links: [],
				Location: {
					X: coordinates.x,
					Y: coordinates.y
				}
			};

			this.setDefaultMapObjectSelection();
			this.props.actions.mapActions.addStep(junction);
		}
	};

	onMouseEnter = () => {
		this.setState({
			isMouseOver: true
			//mapSelection: null
		});
	};

	onMouseLeave = () => {
		this.setState({
			isMouseOver: false
			//mapSelection: null
		});
	};

	onMouseMove = (e: any) => {
		e.preventDefault();
		const { dragging, isMouseDown, selected, sourcestep, mapSelection } = this.state;

		const { map } = this.props;

		if (!isMouseDown) return;

		const coordinates = this.getCoordinates(e);

		if (Object.keys(selected).length === 0 && mapSelection.x !== 9999) {
			let x: any = mapSelection.x !== 9999 ? mapSelection.x : coordinates.x;
			let y: any = mapSelection.x !== 9999 ? mapSelection.y : coordinates.y;
			let width = coordinates.x - x;
			let height = coordinates.y - y;

			this.setState({
				mapSelection: {
					x: mapSelection.x,
					y: mapSelection.y,
					height: height,
					width: width
				}
			});
		} else if (selected === null) {
			console.log('not selecte');
		} else if (this.getDrawLink() && sourcestep) {
			let step = this.getStep(sourcestep);

			if (!step) return;

			let startX = step.Location.X + ImageConst.CX / 2 + ImageConst.IMAGEWIDTH / 2 + ImageConst.ANCHOROFFSET;
			let startY = step.Location.Y + ImageConst.CY / 2;

			const drag_line = document.getElementById('drag_line');
			// update drag line
			drag_line.setAttribute('d', 'M' + startX + ',' + startY + 'L' + coordinates.x + ',' + coordinates.y);
		} else if (!this.getDrawLink()) {
			const steps = [ ...map.Steps ];

			const deltaX = dragging ? e.pageX - dragging.x : 0;
			const deltaY = dragging ? e.pageY - dragging.y : 0;

			steps.filter(({ Id }) => selected[Id]).forEach((step) => {
				let s = JSON.parse(JSON.stringify(step));
				s.Location.X += deltaX;
				s.Location.Y += deltaY;

				if (Array.isArray(s.Links) && s.Links.length > 0) {
					s.Links.forEach((link: Link) => {
						if (Array.isArray(link.Anchor) && link.Anchor.length > 0) {
							link.Anchor.forEach((a: Anchor) => {
								a.X += deltaX;
								a.Y += deltaY;
							});
						}
					});
				}
				this.props.actions.mapActions.updateStep(s);
			});

			this.setState({ dragging: { x: e.pageX, y: e.pageY } });
		}
	};

	onMouseUp = (event: any) => {
		const {
			sourcestep
			//destinationstep
		} = this.state;

		const { map } = this.props;

		//let selected = Object.assign({}, this.state.selected);

		this.setSelection();

		if (this.getDrawLink()) {
			// hide drag line
			const drag_line = document.getElementById('drag_line');
			drag_line.setAttribute('d', 'M0,0 L0,0');

			this.setDefaultMapObjectSelection();

			let destinationStepId = '0';
			if (sourcestep) {
				map.Steps.forEach((step: Step) => {
					const coordinates = this.getCoordinates(event);

					const { Id, StepTypeName, Location } = step;

					const isInside =
						coordinates.x >= Location.X &&
						coordinates.y >= Location.Y &&
						coordinates.x <= Location.X + ImageConst.IMAGEWIDTH &&
						coordinates.y <= Location.Y + ImageConst.IMAGEHEIGHT;

					if (isInside && StepTypeName !== 'Begin') destinationStepId = Id;
				});

				let sourceStep = this.getStep(sourcestep);

				if (destinationStepId === '0' || (sourceStep && sourceStep.Id === destinationStepId)) return;

				let s = JSON.parse(JSON.stringify(sourceStep));
				let link = {
					$type: 'Ultimus.ProcessMap.Link, Ultimus.ProcessMap',
					TargetStepId: destinationStepId,
					TargetStep: destinationStepId,
					Anchor: []
				};

				let ll;
				if (s.Links != null) {
					ll = s.Links.filter((l: any) => {
						return l.TargetStepId === destinationStepId;
					})[0];
				}
				if (!ll) {
					s = { ...s, Links: [ ...s.Links, link ] };

					this.props.actions.mapActions.updateStep(s);
				}
			}
		}

		this.setState({
			dragging: null,
			isMouseDown: false
			//mapSelection: {
			//	x: 9999,
			//	y: 9999,
			//	height: 0,
			//	width: 0
			//	},
			//	selected
		});
	};

	getStep = (step: any) => {
		const { map } = this.props;

		const steps = [ ...map.Steps ];

		return steps.filter(function(element) {
			return step[element.Id];
		})[0];
	};

	setDefaultMapObjectSelection = () => {
		this.props.actions.navActions.navSelection(mapObjectSelection.Pointer);
	};

	onWindowResize = (container: any) => {
		return () => {
			//const rect = container.getBoundingClientRect();
			const size = this.getBrowserSize();
			this.setState({ size: size });
		};
	};

	onWindowScroll = () => {
		const scroll = {
			x: window.scrollX,
			y: window.scrollY
		};

		this.setState({ scroll });
	};

	onWheel = (e) => {
		window.scrollTo(window.scrollX,  window.scrollY-e.wheelDelta);		
	}

	selectStep = (id: any) => {
		return (event: any) => {
			event.stopPropagation();

			const { selected, shiftPressed, stepPropsShown } = this.state;

			if (stepPropsShown) this.updateMap();

			let selectedStep = shiftPressed ? Object.assign({}, selected) : {};
			selectedStep[id] = true;

			let step = Object.assign({}, this.getStep(selectedStep));
			this.setState({
				isMouseDown: true,
				selected: selectedStep,
				sourcestep: selectedStep,
				step: step
			});

			// reposition drag line
			/*if (this.getDrawLink()) {
				if (step.Name === 'End') return;

				let startX = step.Location.X + ImageConst.CX / 2 + ImageConst.IMAGEWIDTH / 2 + ImageConst.ANCHOROFFSET;
				let startY = step.Location.Y + ImageConst.CY / 2;

				drag_line
					.style('marker-start', 'url(#Circle)')
					.style('marker-end', 'url(#Triangle)')
					.classed('hidden', false)
					.attr('d', 'M' + startX + ',' + startY + 'L' + startX + ',' + startY);
			}*/
		};
	};

	showStepProps = (id: any) => {
		return (event: any) => {
			event.stopPropagation();

			const { selected, shiftPressed } = this.state;

			let selectedStep = shiftPressed ? Object.assign({}, selected) : {};
			selectedStep[id] = true;

			this.setState({
				selected: selectedStep,
				stepPropsShown: true
			});
		};
	};

	updateMap = () => {
		//this.props.actions.updateMap(this.state.step);
		// const { step } = this.state;
		// const { map } = this.props;
		// const steps = [...map.Steps];
		// steps
		//     .filter(s => s.Name === step.Name)
		//     .forEach(s => {
		//         Object.assign(s, step);
		//     });
	};

	closeStepProps = () => {
		this.updateMap();

		this.setState({
			stepPropsShown: false,
			step: {}
		});
	};

	updateStepProps = (event: any) => {
		const field = event.target.name;
		let step = Object.assign({}, this.state.step);
		step[field] = event.target.value;
		return this.setState({ step: step });
	};

	stopDragging = (id: any) => {
		return (event: any) => {
			this.setState({
				dragging: null,
				isMouseDown: false,
				mapSelection: null
			});
		};
	};

	isEmpty = (o: any) => {
		for (var i in o) {
			if (o.hasOwnProperty(i)) {
				return false;
			}
		}
		return true;
	};

	public renderProperty(): JSX.Element {
		const { step, stepPropsShown } = this.state;

		if (stepPropsShown === false) return <div />;

		return <PropsPage step={step} onChange={this.updateStepProps} closeStepProps={this.closeStepProps} />;
	}

	public renderMap = (): JSX.Element => {
		const { map, bpmLocale, playbackHistory } = this.props;
		const { grid } = this.props.editorContext;
		const { mapSelection, selected, size, frameIndex, playback } = this.state;
		const style = { display: 'flex', justifyContent: 'space-between' };

		return (
			<div
				id="map"
				onMouseDown={this.onMouseDown}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onMouseMove={this.onMouseMove}
				onMouseUp={this.onMouseUp}
				style={style}
			>
				<Map
					map={map}
					playbackHistory={playbackHistory}
					playback={playback}
					frameIndex={frameIndex}
					bpmLocale={bpmLocale}
					params={this.props.params}
					mapSelection={mapSelection}
					selected={selected}
					selectStep={this.selectStep}
					stopDragging={this.stopDragging}
					showStepProps={this.showStepProps}
					size={size}
					showGrid={grid > 0 ? true : false}
				/>
				<section>{this.renderProperty()}</section>
			</div>
		);
	};

	componentWillReceiveProps(nextProps) {
		const { playbackHistory } = this.props;

		if (playbackHistory.playbackHistorySuccess) return;

		if (nextProps.playbackHistory.playbackHistorySuccess && nextProps.playbackHistory.FrameRecords.length > 0) {
			this.startPlaybackTimer();
		}
	}

	public renderMapView = (): JSX.Element => {
		const { map, bpmLocale, playbackHistory } = this.props;
		const { grid } = this.props.editorContext;
		const { processName, incident } = this.props.params;
		const { mapSelection, selected, size, frameIndex, playback, pause, enableNextBtn, enablePrevBtn } = this.state;
		const hideSpeedDial = !this.props.params.playback;
		const style = { display: 'flex', justifyContent: 'space-between' };
		//console.log('curr: ', frameIndex, 'next: ', enableNextBtn, 'prev: ', enablePrevBtn);

		return (
			<div style={style}>
				<Map
					map={map}
					playbackHistory={playbackHistory}
					playback={playback}
					frameIndex={frameIndex}
					bpmLocale={bpmLocale}
					params={this.props.params}
					mapSelection={mapSelection}
					selected={selected}
					selectStep={this.selectStep}
					stopDragging={this.stopDragging}
					showStepProps={this.showStepProps}
					size={size}
					showGrid={grid > 0 ? true : false}
				/>
				{!hideSpeedDial ? (
					<SpeedDials
						processName={processName}
						incident={incident}
						playbackHistory={playbackHistory}
						playback={playback}
						frameIndex={frameIndex}
						pause={pause}
						startPlayback={this.startPlayback}
						stopPlayback={this.stopPlayback}
						pausePlayback={this.pausePlayback}
						nextPlayback={this.nextPlayback}
						prevPlayback={this.prevPlayback}
						enableNextBtn={enableNextBtn}
						enablePrevBtn={enablePrevBtn}
					/>
				) : (
					''
				)}
			</div>
		);
	};

	handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		this.selectStep({ playback: true });
	};

	render() {
		const { editable } = this.props.params;

		const errorStyle = { color: 'red' };

		if (this.props.hasErrored) {
			return (
				<span style={errorStyle}>
					<i>{this.props.errorMessage}</i>
				</span>
			);
		}

		if (this.props.isLoading) {
			return (
				<span>
					<i>Loading...</i>
				</span>
			);
		} else {
			return editable ? (
				<React.Fragment>{this.renderMap()}</React.Fragment>
			) : (
				<React.Fragment>{this.renderMapView()}</React.Fragment>
			);
		}
	}
}

// MapView.prototype = {
//     map: PropTypes.object.isRequired: {map: any}
//     //actions: PropTypes.object.isRequired
// };

const mapStateToProps = (state: any, ownProps: any) => {
	return {
		map: state.data.map,
		playbackHistory: state.data.playbackHistory,
		editorContext: state.editorContext,
		bpmLocale: state.localizedData,
		isLoading: state.data.isLoading,
		hasErrored: state.data.hasErrored,
		errorMessage: state.data.errorMessage
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		actions: {
			mapActions: bindActionCreators(mapActions, dispatch),
			navActions: bindActionCreators(navActions, dispatch)
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);

interface IMapSelection {
	x: any;
	y: any;
	height: any;
	width: any;
}

interface IMapViewState {
	dragging?: any;
	isMouseDown: boolean;
	isMouseMoving: boolean;
	isMouseOver: boolean;
	offset: any;
	mapSelection?: IMapSelection | null;
	scroll: any;
	selected: any;
	shiftPressed: boolean;
	toolbarHeight: number;
	sourcestep: {};
	destinationstep: {};
	stepPropsShown: boolean;
	step: {};
	size: {};
	actions: any;
	playback: boolean;
	pause: boolean;
	frameIndex: number;
	enableNextBtn: boolean;
	enablePrevBtn: boolean;
	timeoutId: any;
}

interface IMapViewProps {
	map: MapData;
	playbackHistory: PlaybackHistory;
	editorContext: IEditorContext;
	bpmLocale: BpmLocale[];
	params: IParam;
	actions: any;
	isLoading: boolean;
	errorMessage: string;
	hasErrored: boolean;
}
