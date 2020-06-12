////declare module namespace {

export interface Anchor {
	X: number;
	Y: number;
}

export interface Link {
	TargetStepId: string;
	TargetStep?: any;
	Anchor: Anchor[];
}

export interface VLink {
	VColor: string;
	TargetStepId: string;
	TargetStep?: any;
	Anchor: any[];
}

export interface AssociationLink {
	linkStepId: string;
	m_bFromTop: boolean;
}

export interface Location {
	X: number;
	Y: number;
}

export interface Step {
	$type: string;
	CompletionTime?: any;
	ExtensionTime?: any;
	DelayTime?: any;
	ArchiveSpecified: boolean;
	ProtectedStepSpecified: boolean;
	PrivateStepSpecified: boolean;
	CPSConnector?: any;
	CustomFormURL?: any;
	DefaultFormSpecified: boolean;
	HelpURL?: any;
	TaskCostPerHour?: any;
	StepRecipient?: any;
	StepRecipientsOrganization?: any;
	RecipientTypeSpecified: boolean;
	ResubmittableSpecified: boolean;
	MinimumResponse?: any;
	StepTypeName: string;
	Schema?: any;
	BinarySchema?: any;
	Links: Link[];
	VLinks: VLink[];
	AssociationLinks: AssociationLink[];
	Justify: string;
	Color: number;
	TextColor: number;
	dwSize: number;
	BorderColor: number;
	GradientColor: number;
	bIsFont: boolean;
	FontObj?: any;
	RectColor: string;
	strSimColor: string;
	Text: string;
	Id: string;
	Name: string;
	Location: Location;
	LaunchType?: number;
	AllowAnonymousUser?: boolean;
	DayofMonth?: any;
	Time?: any;
	Frequency?: any;
	IncidentStart?: any;
	FloStationType?: number;
	FlobotName: string;
	Flostation?: any;
	InlineSpecified?: boolean;
	TimeOut?: any;
	DelayTimeNotes?: any;
}

export interface FontObj {
	FaceName: string;
	Size: number;
	Bold: number;
	Italic: number;
	Underline: number;
	Id: number;
}

export interface Location2 {
	X: number;
	Y: number;
}

export interface TextObject {
	$type: string;
	StepTypeName: string;
	Schema?: any;
	BinarySchema?: any;
	Links: any[];
	VLinks: any[];
	AssociationLinks: any[];
	Justify: string;
	Color: number;
	TextColor: number;
	dwSize: number;
	BorderColor: number;
	GradientColor: number;
	bIsFont: boolean;
	FontObj: FontObj;
	RectColor: string;
	strSimColor?: any;
	Text: string;
	Id: string;
	Name: string;
	Location: Location2;
}

export interface GroupObject {
	strGroupId: string;
	strText: string;
	strParentId: string;
	strArraystepsIds: string[];
	strArraySubGroupsIds: string[];
	left: number;
	top: number;
	right: number;
	bottom: number;
	fontData: FontObj;
	groupbackColor: string;
	TextColor: string;
}

export interface StepPoint {
	X: number;
	Y: number;
}

export interface StepContext {
	StepPoint: StepPoint;
	StepLabel: string;
	StepID: string;
	StepType: number;
	RecipientType: number;
	strRecipient: string;
	ListAssignedToUserNames: string[];
	ListAssignedToUserFullNames: string[];
	ListTaskIDs: string[];
	strStepOrg: string;
	ListTaskStatus: number[];
	ListTaskSubStatus: number[];
	IncidentStatus: number;
	ProcessVersion: number;
}

export interface ISwimColor {
	Color: string;
	Name: string;
}

export interface Location3 {
	X: number;
	Y: number;
}

export interface ISwimPool {
	Location: Location3;
	strSwimID: string;
}

export interface MapData {
	ProcessName: string;
	ProcessInformation?: any;
	Steps: Step[];
	TextObjects: TextObject[];
	StepContexts: StepContext[];
	SwimColors: ISwimColor[];
	SwimPools: ISwimPool[];
	GroupObjects: GroupObject[];
	SwimPoolHight: number;
	Style: string;
	Height: number;
	Width: number;
}

export interface RootObject {
	Message?: any;
	Status: number;
	Data: MapData;
}

export interface Data {
	map: MapData;
	playbackHistory: any;
	isLoading: boolean;
	hasErrored: boolean;
	errorMessage: string;
}

export interface IParam {
	processName: string | undefined | null | string[];
	incident?: number;
	version: number;
	isBPMNView: boolean;
	editable: boolean;
	bpmServer: string | undefined | null | string[];
	hostName: string | undefined | null | string[];
	port: string | undefined | null | string[];
	protocol: string | undefined | null | string[];
	serverId: string | undefined | null | string[];
	language: string | undefined | null | string[];
	playback: boolean;
}

export interface IEditorContext {
	nav: number;
	grid: number;
	zoomFactor: number;
}

export interface BpmLocale {
	Id: number;
	LocaleType: number;
	LanguageCode: string;
	ServerId: number;
	Label: string;
	Translation: string;
	ParentId?: number;
}
// The top-level state object
export interface ApplicationState {
	data: Data;
	localizedData: BpmLocale[];
}

export interface Rect {
	X: number;
	Y: number;
	Width: number;
	Height: number;
}

export interface FrameRecord {
	ID: string;
	ParentID: string;
	Msg: string;
	EvalMsg: string;
	StepLabel: string;
	Title: string;
	FrameType: number;
	FrameTime: any;
	EventActionType: number;
	RecRc: Rect;
	HiliteColor: string;
	Enabled: boolean;
	FlowPoints: FlowPoint[];
}

export interface PlaybackHistory {
	FrameRecords: FrameRecord[];
	SetRect: boolean;
	playbackHistorySuccess: boolean;
}

export interface FlowPoint {
	FlowPt1: Location;
	FlowPt2: Location;
	FlowType: number;
}

//}
