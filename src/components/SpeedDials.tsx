import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial, { SpeedDialProps } from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { SkipPrevious, SkipNext, Pause, PlayArrow, Stop } from '@material-ui/icons';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {
	createMuiTheme,
	responsiveFontSizes,
	MuiThemeProvider,
	useMediaQuery,
	Popper,
	Paper,
	Fade,
	Typography,
	Tooltip,
	Snackbar
} from '@material-ui/core';
import { FrameRecord } from '../interface/map';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

theme.typography.h6 = {
	fontSize: '1.2rem',
	'@media (min-width:300px)': {
		fontSize: '1rem'
	},
	[theme.breakpoints.up('md')]: {
		fontSize: '1.25rem'
	}
};

theme.typography.body1 = {
	fontSize: '1rem',
	'@media (min-width:300px)': {
		fontSize: '0.80rem'
	},
	[theme.breakpoints.up('md')]: {
		fontSize: '1rem'
	}
};

theme.typography.body2 = {
	fontSize: '.80rem',
	lineBreak: 'auto',
	'@media (min-width:300px)': {
		fontSize: '0.70rem'
	},
	[theme.breakpoints.up('md')]: {
		fontSize: '.80rem'
	}
};

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="outlined" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			transform: 'translateZ(0px)',
			flexGrow: 1
		},
		speedDial: {
			position: 'absolute',
			'&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
				bottom: theme.spacing(2),
				right: theme.spacing(2),
				margin: theme.spacing(1)
			},
			'&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
				top: theme.spacing(2),
				left: theme.spacing(2)
			}
		},
		paper: {
			border: '1px solid',
			padding: theme.spacing(1),
			backgroundColor: theme.palette.background.paper
		},
		typography: {
			paddingLeft: theme.spacing(1),
			paddingTop: theme.spacing(1)
		},
		typography1: {
			paddingLeft: theme.spacing(1),
			paddingTop: theme.spacing(0),
			paddingBottom: theme.spacing(0)
		}
	})
);

const actions = [
	{ icon: <SkipPrevious />, name: 'Previous', operation: 'previous' },
	{ icon: <SkipNext />, name: 'Next', operation: 'next' },
	{ icon: <Pause />, name: 'Pause', operation: 'pause' }
];

export default function SpeedDials(props) {
	const classes = useStyles();

	const matches = useMediaQuery(theme.breakpoints.up('md'));
	const [ open, setOpen ] = useState(false);
	const [ direction ] = useState<SpeedDialProps['direction']>('left');
	const [ openSB, setOpenSB ] = useState(false);
	const [ msg, setMsg ] = useState('');
	const [ stepLabel, setStepLabel ] = useState('');
	const [ frameTime, setframeTime ] = useState('');
	const [ evalMsgTitle, setEvalMsgTitle ] = useState('');
	const [ evalMsg, setEvalMsg ] = useState('');
	//const [ hiliteColor, setHiliteColor ] = useState('');

	useEffect(
		() => {
			if (!props.playback && open) handleClose();
		},
		[ props.playback, open ]
	);

	useEffect(
		() => {
			const { FrameRecords } = props.playbackHistory;

			setStepLabel('');
			setMsg('');
			setframeTime('');
			setEvalMsgTitle('');
			setEvalMsg('');

			let currIndex = props.frameIndex - 1;
			if (FrameRecords.length === 0) return;
			if (currIndex < 0) return;

			const frameRec: FrameRecord = FrameRecords[currIndex];
			const msg = frameRec.Msg.replace('EVAL', ' Evaluated to ');
			const event = new Date(frameRec.FrameTime);
			const evalMsg =
				frameRec.EvalMsg === ''
					? frameRec.EvalMsg.replace('', 'No Rule Information available.')
					: frameRec.EvalMsg.replace('NOHISTORY', 'No Rule Information available.');

			//setHiliteColor(frameRec.HiliteColor);
			setStepLabel(frameRec.StepLabel + ':');
			setMsg(msg);
			setframeTime(event.toUTCString());
			setEvalMsgTitle('Rule Evaluation Results');
			setEvalMsg(evalMsg);
		},
		[ props.frameIndex, props.playbackHistory ]
	);

	const handleOpenClose = (event: any, r: any) => {
		if (!open) props.startPlayback();
		else props.stopPlayback();

		setStepLabel('');
		setMsg('');
		setframeTime('');
		setEvalMsg('');
		setEvalMsgTitle('');

		setOpen(!open);
	};

	const handleClose = () => {
		setOpen(false);
		setOpenSB(true);
	};

	const handleCloseSB = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSB(false);
	};

	const handleClick = (e: any, operation: any) => {
		e.preventDefault();
		if (operation === 'next') props.nextPlayback();
		else if (operation === 'play') props.startPlayback();
		else if (operation === 'previous') props.prevPlayback();
		else if (operation === 'stop') props.stopPlayback();
		else if (operation === 'pause') props.pausePlayback();
	};

	const isDisable = (action: string): boolean => {
		if (action === 'Next') return !props.enableNextBtn;
		else if (action === 'Previous') return !props.enablePrevBtn;
		else return false;
	};

	return (
		<div className={classes.root}>
			<MuiThemeProvider theme={theme}>
				<Snackbar open={openSB} autoHideDuration={5000} onClose={handleCloseSB}>
					<Alert onClose={handleCloseSB} severity="info">
						{`Playback for ${props.processName}, Incident: ${props.incident} is completed.`}
					</Alert>
				</Snackbar>
				<Popper
					open={open}
					style={{ position: 'fixed', bottom: 80, right: 30, top: 'unset', left: 'unset' }}
					transition={true}
				>
					{({ TransitionProps }) => (
						<Fade {...TransitionProps} timeout={350}>
							<Paper elevation={0} style={{ width: matches ? 350 : 270, height: matches ? 300 : 250 }}>
								<div style={{ display: 'flex' }}>
									<Typography variant="h6" className={classes.typography}>
										{stepLabel}
									</Typography>
									<Typography variant="h6" className={classes.typography}>
										{msg}
									</Typography>
								</div>
								<Typography variant="body1" className={classes.typography1}>
									{frameTime}
								</Typography>
								<Typography variant="h6" className={classes.typography}>
									{evalMsgTitle}
								</Typography>
								{evalMsg.split(/\r?\n/).map((i, key) => {
									return (
										<Typography key={key} variant="body2" className={classes.typography1}>
											{i}
										</Typography>
									);
								})}
							</Paper>
						</Fade>
					)}
				</Popper>
				<SpeedDial
					ariaLabel="SpeedDial"
					className={classes.speedDial}
					icon={
						<SpeedDialIcon
							icon={
								<Tooltip title={open ? 'Stop Playback History' : 'Playback History'} placement="top">
									<PlayArrow />
								</Tooltip>
							}
							openIcon={<Stop />}
							onClick={(e) => {
								handleOpenClose(e, 'click');
							}}
						/>
					}
					open={open}
					direction={direction}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.name === 'Pause' && props.pause ? <PlayArrow /> : action.icon}
							tooltipTitle={action.name === 'Pause' && props.pause ? 'Play' : action.name}
							FabProps={{ disabled: isDisable(action.name) }}
							onClick={(e) => {
								handleClick(e, action.operation);
							}}
						/>
					))}
				</SpeedDial>
			</MuiThemeProvider>
		</div>
	);
}
