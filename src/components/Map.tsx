import * as CSS from 'csstype';
import * as React from 'react';
import {
	//fitSelection,
	//fitToViewer,
	INITIAL_VALUE,
	ReactSVGPanZoom,
	TOOL_NONE
	//zoomOnViewerCenter
} from 'react-svg-pan-zoom';
import {
	Anchor,
	AssociationLink,
	BpmLocale,
	IParam,
	ISwimColor,
	Link,
	MapData,
	Step,
	VLink,
	PlaybackHistory,
	FrameRecord,
	Rect,
	FlowPoint,
	GroupObject
} from '../interface/map';
import BeginStep from './BeginStep';
import { LocaleType, RULES_EVENTTYPES, RULES_ACTIONTYPES, FRAMETYPES } from './constant';
import EndStep from './EndStep';
import FlobotStep from './FlobotStep';
import * as ImageConst from './imageConst';
import JunctionStep from './JunctionStep';
import './Map.css';
import MapletStep from './MapletStep';
import MapSelection from './MapSelection';
import Polyline from './Polyline';
import SwimPool from './SwimPool';
import TextObject from './TextObject';
import UserStep from './UserStep';
import GroupRect from './GroupRect';
import { getColorFromBGR } from '../utils/global';

const component: any = {
	Begin: BeginStep,
	End: EndStep,
	User: UserStep,
	Junction: JunctionStep,
	Flobot: FlobotStep,
	Maplet: MapletStep
};

class Map extends React.Component<IMap, IMapState> {
	Viewer: any;
	constructor(props: IMap, context: any) {
		super(props, context);
		this.Viewer = null;

		this.state = {
			translation: { x: 0, y: 0, scaleFactor: -1 },
			tool: TOOL_NONE,
			value: INITIAL_VALUE,
			FrameIdx: 0,
			FrameRecords: [],
			isMouseDown: false
		};
	}

	onWindowResize = () => {
		return () => {
			if (this.Viewer) this.Viewer.fitToViewer();
		};
	};

	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize());
		this.Viewer.fitToViewer();
	}

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

		return size;
	};

	getTextObject = (id: string) => {
		const { map } = this.props;

		const textObjects = [ ...map.TextObjects ];

		return textObjects.filter(function(element) {
			return id === element.Id;
		})[0];
	};

	getStep = (id: string) => {
		const { map } = this.props;

		const steps = [ ...map.Steps ];

		return steps.filter(function(element) {
			return id === element.Id;
		})[0];
	};

	getStepByName = (name: string) => {
		const { map } = this.props;

		const steps = [ ...map.Steps ];

		return steps.filter(function(element) {
			return name === element.Name;
		})[0];
	};

	getStepContext = (id: string) => {
		const { map } = this.props;

		const stepContexts = [ ...map.StepContexts ];

		return stepContexts.filter(function(element) {
			return id === element.StepID;
		})[0];
	};

	getLinkPoints = (srourceStep: Step, targetLink: Link) => {
		let targetStep = this.getStep(targetLink.TargetStepId);

		if (!targetStep) return;

		let startX = srourceStep.Location.X + ImageConst.CX / 2 + ImageConst.IMAGEWIDTH / 2 + ImageConst.ANCHOROFFSET;
		let startY = srourceStep.Location.Y + ImageConst.CY / 2;

		let endX = targetStep.Location.X + ImageConst.CX / 2 - ImageConst.IMAGEWIDTH / 2 - ImageConst.ANCHOROFFSET;
		let endY = targetStep.Location.Y + ImageConst.CY / 2;

		let p = ' ';
		if (targetLink.Anchor !== null && targetLink.Anchor.length > 0) {
			targetLink.Anchor.map((a: Anchor) => (p += ' ' + a.X + ',' + a.Y + ' '));
		}

		return startX + ',' + startY + p + endX + ',' + endY;
	};

	getAssociationLinkPoints = (srourceStep: Step, targetLink: AssociationLink) => {
		let targetStep = this.getTextObject(targetLink.linkStepId);

		if (!targetStep) return;

		let startX = srourceStep.Location.X + ImageConst.CX / 2 + ImageConst.IMAGEWIDTH / 2 + ImageConst.ANCHOROFFSET;
		let startY = srourceStep.Location.Y + ImageConst.CY / 2;

		let endX = targetStep.Location.X + ImageConst.CX / 2 - ImageConst.IMAGEWIDTH / 2 - ImageConst.ANCHOROFFSET;
		let endY = targetStep.Location.Y; // + (ImageConst.CY/2);

		return startX + ',' + startY + ' ' + endX + ',' + endY;
	};

	generateLinks = () => {
		const { map } = this.props;

		const { Steps } = map;

		return Steps.map((step: Step, i: number) => {
			if (step && step.Name !== 'End' && step.Links.length > 0) {
				return step.Links.map((link: Link, j: number) => {
					let points = this.getLinkPoints(step, link);
					let key = step.Id + '$$' + link.TargetStepId;
					return (
						<Polyline
							key={key}
							id={key}
							points={points}
							markerStart={true}
							editable={this.props.params.editable}
						/>
					);
				});
			} else {
				return [];
			}
		});
	};

	generateVLinks = () => {
		const { map } = this.props;

		const { Steps } = map;

		return Steps.map((step: Step, i: number) => {
			if (step && step.Name !== 'End' && step.VLinks && step.VLinks.length > 0) {
				return step.VLinks.map((link: VLink, j: number) => {
					let points = this.getLinkPoints(step, link);
					let key = step.Name + link.TargetStepId;
					return (
						<Polyline
							key={key}
							id={key}
							points={points}
							stroke={link.VColor}
							strokeDasharray={true}
							markerStart={true}
							markerEnd={false}
							editable={this.props.params.editable}
						/>
					);
				});
			} else {
				return [];
			}
		});
	};

	generateAssociationLinks = () => {
		const { map } = this.props;

		const { Steps } = map;

		return Steps.map((step: Step, i: number) => {
			if (step && step.Name !== 'End' && step.AssociationLinks && step.AssociationLinks.length > 0) {
				return step.AssociationLinks.map((link: AssociationLink, j: number) => {
					let points = this.getAssociationLinkPoints(step, link);
					let key = step.Name + link.linkStepId;
					return (
						<Polyline
							key={key}
							id={key}
							points={points}
							markerStart={true}
							markerEnd={false}
							strokeDasharray={true}
							editable={this.props.params.editable}
						/>
					);
				});
			} else {
				return [];
			}
		});
	};

	generateBPMNStartLink = () => {
		const beginStep = this.getStepByName('Begin');

		if (!beginStep) return [];

		let startX = beginStep.Location.X - ImageConst.CX + ImageConst.IMAGEWIDTH - 10;
		let startY = beginStep.Location.Y + ImageConst.CY / 2.0;

		let endX = beginStep.Location.X + ImageConst.CX / 2 - ImageConst.IMAGEWIDTH / 2;
		let endY = beginStep.Location.Y + ImageConst.CY / 2;

		let p = ' ';
		const points = startX + ',' + startY + p + endX + ',' + endY;
		let key = 'start' + beginStep.Name;

		return (
			<Polyline
				key={key}
				id={key}
				points={points}
				markerStart={false}
				markerEnd={false}
				editable={this.props.params.editable}
			/>
		);
	};

	onValueChange = (event: any) => {
		const translation = { x: event.e, y: event.f, scaleFactor: event.d };
		this.setState({ translation: translation });
	};

	getLocalizedElement = (name: string): any => {
		const { bpmLocale } = this.props;

		return bpmLocale.filter((element: BpmLocale) => {
			let labels = element.Label.split('\\*\\');
			return (
				element.LocaleType === LocaleType.Step && labels.length > 1 && labels[1] !== '' && name === labels[1]
			);
		})[0];
	};

	getLocalizedStepName = (name: string) => {
		const { bpmLocale } = this.props;

		let localizedName = '';

		if (!bpmLocale) return localizedName;

		const aa = this.getLocalizedElement(name);

		return aa ? aa.Translation : '';

		// for (let i = 0; i < bpmLocale.length; i++) {
		//   const element = bpmLocale[i];
		//   if (element.LocaleType === LocaleType.Step) {
		//     let labels = element.Label.split("\\*\\");
		//     if (labels.length > 1 && labels[1] !== "" && name === labels[1]) {
		//       localizedName = element.Translation;
		//       break;
		//     }
		//   }
		// }
		// return localizedName;
	};

	isActivateFrame(FrameType: any, EventActionType: number): boolean {
		if (FrameType === FRAMETYPES.ACTION)
			return (
				EventActionType === RULES_ACTIONTYPES.LA_STEPACTIVATED ||
				EventActionType === RULES_ACTIONTYPES.LA_DIRECTACTIVATED ||
				EventActionType === RULES_ACTIONTYPES.LA_STEPACTIVATEDBYRETURN
			);

		return EventActionType === RULES_EVENTTYPES.ACTIVATE;
	}

	setFlowPoints = (frameRecords: FrameRecord[]): FrameRecord[] => {
		// ok, here we simply look at all Event type frames, and then look at any other frame that are Action type that are are a result
		// of that event..

		for (let x = 0; x < frameRecords.length; x++) {
			let srcFrameRec = frameRecords[x];
			if (srcFrameRec.FrameType !== FRAMETYPES.EVENT) continue;
			// ok, it an event., now see if any actions were run because of this event..
			let fps: FlowPoint[] = [];
			for (let Idx = 0; Idx < frameRecords.length; Idx++) {
				let tmpFrameRec = frameRecords[Idx];
				if (tmpFrameRec.FrameType !== FRAMETYPES.ACTION) continue;
				if (tmpFrameRec.ParentID !== srcFrameRec.ID) continue; // this action is not associated with this event.
				if (!this.isActivateFrame(tmpFrameRec.FrameType, tmpFrameRec.EventActionType)) continue;
				if (tmpFrameRec.StepLabel === srcFrameRec.StepLabel) continue;

				// ok, found an action, so we want to draw a line to this step etc.
				let fp: FlowPoint = {
					FlowPt1: {
						X: srcFrameRec.RecRc.X + srcFrameRec.RecRc.Width,
						Y: srcFrameRec.RecRc.Y + srcFrameRec.RecRc.Height / 2
					},
					FlowPt2: {
						X: tmpFrameRec.RecRc.X,
						Y: tmpFrameRec.RecRc.Y + tmpFrameRec.RecRc.Height / 2
					},
					FlowType: srcFrameRec.EventActionType
				};
				fps.push(fp);
			}

			srcFrameRec.FlowPoints = fps;
		}

		return frameRecords;
	};

	getFrameRecords = (FrameRecords: FrameRecord[]): FrameRecord[] => {
		let frameRecords: FrameRecord[] = [];

		if (!FrameRecords) return frameRecords;
		if (FrameRecords.length === 0) return frameRecords;

		for (let x = 0; x < FrameRecords.length; x++) {
			let FrameRec: FrameRecord = JSON.parse(JSON.stringify(FrameRecords[x]));

			const step = this.getStepByName(FrameRec.StepLabel);

			if (step) {
				const rect: Rect = {
					X: step.Location.X,
					Y: step.Location.Y - 15,
					Width: ImageConst.CX,
					Height: ImageConst.CY + 15
				};

				FrameRec.RecRc = rect;
				FrameRec.Title = FrameRec.StepLabel;

				if (
					FrameRec.EventActionType === RULES_EVENTTYPES.ACTIVATE ||
					FrameRec.EventActionType === RULES_ACTIONTYPES.LA_STEPACTIVATED ||
					FrameRec.EventActionType === RULES_ACTIONTYPES.LA_DIRECTACTIVATED ||
					FrameRec.EventActionType === RULES_ACTIONTYPES.LA_STEPACTIVATEDBYRETURN
				) {
					FrameRec.HiliteColor = '#008000'; //Color.Green;
				} else if (FrameRec.EventActionType === RULES_EVENTTYPES.COMPLETED) {
					FrameRec.HiliteColor = '#8FBC8F'; //Color.DarkSeaGreen;
				} else if (FrameRec.EventActionType === RULES_EVENTTYPES.RETURNED) {
					FrameRec.HiliteColor = '#FF0000'; //Color.Red;
				} else if (FrameRec.EventActionType === RULES_EVENTTYPES.ABORTED) {
					FrameRec.HiliteColor = '#8B0000'; //Color.DarkRed;
				} else if (FrameRec.EventActionType === RULES_EVENTTYPES.RESUBMITTED) {
					FrameRec.HiliteColor = '##6A5ACD'; //Color.SlateBlue;
				} else if (FrameRec.EventActionType === RULES_EVENTTYPES.LATE) {
					FrameRec.HiliteColor = '#FFFF00'; //Color.Yellow;
				} else if (FrameRec.EventActionType === RULES_EVENTTYPES.FAILED) {
					FrameRec.HiliteColor = '#808080'; //Color.Gray;
				}
			}

			frameRecords.push(FrameRec);
		}

		console.log('getting frames', frameRecords);
		return this.setFlowPoints(frameRecords);
	};

	drawPlaybackFrame = (): JSX.Element[] => {
		return this.drawOverlays();
	};

	drawFlow(fp: FlowPoint, ActiveFrame: boolean): JSX.Element {
		if (fp.FlowPt1.X === 0) return;

		let color = fp.FlowType === RULES_EVENTTYPES.COMPLETED ? 'green' : 'red';
		let oPac = 0.75;

		if (!ActiveFrame) oPac = 0.25;

		let p = `M${fp.FlowPt1.X},${fp.FlowPt1.Y} T${fp.FlowPt1.X + 25},${fp.FlowPt1.Y - 25} T${fp.FlowPt2.X},${fp
			.FlowPt2.Y}`;

		return (
			<path
				d={p}
				fill={'transparent'}
				stroke={color}
				strokeWidth="2px"
				strokeDasharray="5,5"
				opacity={oPac}
				markerStart={'url(#Circle)'}
				markerEnd={'url(#Triangle)'}
			/>
		);
	}

	drawOverlays = (): JSX.Element[] => {
		// ok, now draw the hilite recs and flow points if any ..but only draw if the FrameIdx <= Hilite Rect Idx.
		// we have 1 Hilite Rec for every Frame..
		const { FrameRecords } = this.state;
		const { frameIndex } = this.props;

		let currIndex = frameIndex - 1;

		if (FrameRecords.length === 0) return;

		if (currIndex < 0) return;

		let rows: JSX.Element[] = [];
		for (let x = 0; x < FrameRecords.length; x++) {
			let FrameRec = FrameRecords[x];
			if (x > currIndex) continue;

			for (let FlowIdx = 0; FlowIdx < FrameRec.FlowPoints.length; FlowIdx++) {
				let fp = FrameRec.FlowPoints[FlowIdx];
				rows.push(this.drawFlow(fp, currIndex === x));
			}

			if (currIndex === x) {
				rows.push(
					<rect
						key={FrameRec.ID}
						x={FrameRec.RecRc.X}
						y={FrameRec.RecRc.Y}
						width={FrameRec.RecRc.Width}
						height={FrameRec.RecRc.Height}
						fill={'transparent'}
						stroke={FrameRec.HiliteColor}
						strokeWidth={ImageConst.SWIMCOLORRECT_STROKEWIDTH}
						rx="3"
					/>
				);
			}
		}

		return rows;
	};

	public renderSteps(): JSX.Element[] {
		const { map, selectStep, stopDragging } = this.props;

		const { Steps } = map;

		if (Steps.length === 0) return [];

		return Steps.map((step: Step) => {
			const { Id, StepTypeName } = step;
			const Step = component[StepTypeName];
			return (
				<Step
					key={Id}
					step={step}
					localizedName={this.getLocalizedStepName(step.Name)}
					isBPMNView={this.props.params.isBPMNView}
					stepContext={this.getStepContext(Id)}
					selectStep={selectStep(Id)}
					stopDragging={stopDragging}
					editable={this.props.params.editable}
					translation={this.state.translation}
					//showStepProps={showStepProps(Name)}
				/>
			);
		});
	}

	public renderTextObjects(): JSX.Element[] {
		const { map } = this.props;

		const { TextObjects } = map;

		return TextObjects.map((textObject: any, i: any) => {
			const { Id } = textObject;
			return <TextObject key={Id} textObject={textObject} editable={this.props.params.editable} />;
		});
	}

	public renderGroupObjects(): JSX.Element[] {
		const { map } = this.props;

		const { GroupObjects } = map;

		return GroupObjects.map((groupObject: GroupObject, i: any) => {
			const { strGroupId } = groupObject;
			return <GroupRect key={strGroupId} groupObject={groupObject} />;
		});
	}

	public defineTextFilter(): JSX.Element[] {
		const { map } = this.props;

		const { TextObjects } = map;

		return TextObjects.map((textObject: any, i: any) => {
			const { Id, Color } = textObject;
			const color = Color !== 16777215 ? '#' + getColorFromBGR(Color) : 'Transparent';
			const operator = Color !== 16777215 ? 'atop' : 'out';
			return (
				<filter key={i} id={Id} x="0" y="0" width="1" height="1">
					<feFlood floodColor={color} />
					<feComposite in="SourceGraphic" operator={operator} />
					{/*<feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
					<feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
					<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />*/}
				</filter>
			);
		});
	}

	public defineSwimColorGradient(): JSX.Element[] {
		const { map } = this.props;

		const { SwimColors } = map;

		if (!SwimColors) return [];

		return SwimColors.map((swimColor: ISwimColor, i: number) => {
			return (
				<linearGradient id={swimColor.Name.replace(/ /g, '_')} key={i} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stopColor="white" stopOpacity="1" />
					<stop offset="25%" stopColor={swimColor.Color} stopOpacity="0.5" />
					<stop offset="50%" stopColor={swimColor.Color} stopOpacity="1" />
					<stop offset="100%" stopColor={swimColor.Color} stopOpacity="0" />
				</linearGradient>
			);
		});
	}

	public renderSwimColor(): JSX.Element[] {
		const { map } = this.props;

		const { SwimPools, SwimColors } = map;

		if (!SwimPools) return [];

		return SwimPools.map((swimPool: any, i: any) => {
			return <SwimPool key={swimPool.strSwimID} swimPool={swimPool} swimColors={SwimColors} />;
		});
	}

	componentWillReceiveProps(nextProps) {
		const { FrameRecords } = this.state;

		if (FrameRecords.length === 0)
			this.setState({ FrameRecords: this.getFrameRecords(nextProps.playbackHistory.FrameRecords) });
	}

	onMouseDown = (e: any) => {
		this.setState({ isMouseDown: true });
		console.log('mousedonw: ', e);
	};

	onMouseUp = (e: any) => {
		this.setState({ isMouseDown: false });
	};

	onMouseMove = (e: any) => {
		const { isMouseDown } = this.state;
		if (isMouseDown) {
		}
	};

	drawline = (x1, y1, x2, y2): JSX.Element => {
		const points = x1 + ',' + y1 + ' ' + x2 + ',' + y2;
		return (
			<Polyline
				id={points}
				points={points}
				stroke="LightGray"
				markerStart={false}
				markerMid={false}
				markerEnd={false}
				editable={false}
			/>
		);
	};

	drawGrid = (bounds, xfactor, yfactor): JSX.Element[] => {
		const size = this.getBrowserSize();
		bounds.Right = size.width;
		bounds.Bottom = size.height;

		let lines = [];
		for (let i = bounds.Left; i < bounds.Right; i = i + xfactor) {
			lines.push(this.drawline(i, bounds.Top, i, bounds.Bottom));
		}
		for (let j = bounds.Top; j < bounds.Bottom; j = j + yfactor) {
			lines.push(this.drawline(bounds.Left, j, bounds.Right, j));
		}

		return lines;
	};

	render() {
		const { map, mapSelection, size, playback, showGrid } = this.props;
		const { editable } = this.props.params;
		const { Height, Width } = map;

		const style: CSS.Properties<string | number> = {
			position: 'relative',
			cursor: 'auto',
			flexGrow: 1
		};

		const tooltipStyle: CSS.Properties<string | number> = {
			display: 'none',
			position: 'absolute',
			zIndex: 1001,
			backgroundColor: 'black',
			opacity: 0.8
		};

		return (
			<React.Fragment>
				<ReactSVGPanZoom
					width={size.width + 7000}
					height={size.height + 7000}
					background="white"
					toolbarPosition="none"
					miniaturePosition="none"
					tool={editable ? TOOL_NONE : 'auto'}
					ref={(Viewer: any) => (this.Viewer = Viewer)}
					value={this.state.value}
					detectAutoPan={false}
					//onChangeValue={(value: any) => this.changeValue(value)}
					onChangeValue={this.onValueChange}
					scaleFactorMax={1} //{3}
					scaleFactorMin={1} //{0.4}
					fitToViewer={true}
					style={style}
				>
					<svg
						id="svg"
						height={Height}
						width={Width}
						style={style}
						//onMouseDown={this.onMouseDown}
						//onMouseMove={this.onMouseMove}
						//onMouseUp={this.onMouseUp}
					>
						<defs>
							<marker
								id="Triangle2"
								viewBox="0 0 10 10"
								markerWidth="8"
								markerHeight="8"
								refX="5"
								refY="5"
								orient="auto"
							>
								<circle cx="5.01" cy="5.13" r="5" fill="white" />
								<path
									d="M8.53,1.46a5,5,0,1,0,0,7.08A5,5,0,0,0,8.53,1.46Zm-2.7,5L3.33,7.92V2.08l2.5,1.46L8.33,5Z"
									fill="#8d9aad"
								/>
							</marker>
							<marker id="Triangle" markerWidth="8" markerHeight="8" refX="5" refY="5" orient="auto">
								<circle cx="5" cy="5" r="2" fill="#8d9aad" />
								<circle cx="5" cy="5" r="3" fill="#8d9aad" />
								<path d="M 4,3.5 L 6.5,5 L 4,6.5 Z" fill="white" />
								{/* <path d="M 4,3.5 L 6.5,5 L 4,6.5 Z" fill="gray"/> */}
								{/* <path d="M 0,0 L 6,3 L 0,6 z" fill="#8d9aad"/> */}
							</marker>
							<marker
								id="Circle"
								viewBox="0 0 10 10"
								refX="5"
								refY="5"
								markerUnits="strokeWidth"
								markerWidth="6"
								markerHeight="6"
								orient="auto"
							>
								<circle cx="5" cy="5" r="3" fill="#8d9aad" />
							</marker>
							<marker
								id="MidCircle"
								viewBox="0 0 10 10"
								refX="5"
								refY="5"
								markerUnits="strokeWidth"
								markerWidth="6"
								markerHeight="6"
								orient="auto"
							>
								<circle cx="5" cy="5" r="3" fill="black" />
								<circle cx="5" cy="5" r="2" fill="white" />
							</marker>

							{this.defineSwimColorGradient()}
							{this.defineTextFilter()}
						</defs>
						<path
							id="drag_line"
							d="M0,0 L0,0"
							stroke="#8d9aad"
							strokeWidth="1"
							markerStart={'url(#Circle)'}
							markerEnd={'url(#Triangle)'}
						/>
						{showGrid ? this.drawGrid({ Left: 0, Top: 0, Right: 2000, Bottom: 2000 }, 64, 64) : null}
						{this.renderGroupObjects()}
						{this.renderSteps()}
						{this.renderTextObjects()}
						{this.generateLinks()}
						{this.generateVLinks()}
						{this.generateAssociationLinks()}
						{this.renderSwimColor()}
						{playback ? this.drawPlaybackFrame() : ''}

						{this.props.params.isBPMNView === true ? this.generateBPMNStartLink() : ''}

						{mapSelection ? <MapSelection {...mapSelection} /> : null}
					</svg>
				</ReactSVGPanZoom>
				<div id="tooltip" style={tooltipStyle} />
			</React.Fragment>
		);
	}
}

export default Map;

interface IMap {
	map: MapData;
	playbackHistory: PlaybackHistory;
	playback: boolean;
	frameIndex: number;
	bpmLocale: BpmLocale[];
	params: IParam;
	mapSelection: any | null;
	selected: any;
	selectStep: any;
	stopDragging: any;
	showStepProps: any;
	size: any;
	showGrid: boolean;
}

interface ITranslation {
	x: number;
	y: number;
	scaleFactor: number;
}

interface IMapState {
	translation: ITranslation;
	tool: any;
	value: any;
	FrameIdx: number;
	FrameRecords: FrameRecord[];
	isMouseDown: boolean;
}
