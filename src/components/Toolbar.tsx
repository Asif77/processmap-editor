import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { CURSOR, USER_STEP, JUNCTION, MAPLET, LINK, GRID, SNAPTO } from './MapImages';
import { useSelector, useDispatch } from 'react-redux';
import * as navActions from '../actions/navActions';
import { mapObjectSelection } from './constant';
import Divider from '@material-ui/core/Divider';

import Popper, { PopperProps } from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1
		},
		menuButton: {
			marginRight: theme.spacing(2)
		},
		title: {
			//flexGrow: 1,
		},
		buttonRoot: {
			marginLeft: theme.spacing(12)
		},
		divider: {
			margin: theme.spacing(1, 0.5)
		},
		back: {
			background: 'white'
		},
		popper: {
			margin: theme.spacing(1)
		}
	})
);

export default function ButtonAppBar() {
	const classes = useStyles();
	const [ selected, setSelected ] = useState('arrow');
	const [ gridSelected, setGridSelected ] = useState(0);
	const nav = useSelector((state) => state.editorContext.nav);
	const grid = useSelector((state) => state.editorContext.grid);
	const dispatch = useDispatch();

	const [ open, setOpen ] = React.useState(true);
	const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);

	useEffect(
		() => {
			setToggleButton(nav);
			return () => {
				//cleanup
			};
		},
		[ nav ]
	);

	useEffect(
		() => {
			setGridSelected(grid);
		},
		[ grid ]
	);

	const handleChange2 = (event: React.MouseEvent<HTMLElement>, newValue: number) => {
		console.log(newValue);
		if (newValue === 2) {
		} else dispatch(navActions.gridSelection(gridSelected === 0 ? 1 : 0));
		if (!open) {
			console.log('open');
			setAnchorEl(anchorEl ? null : event.currentTarget);
			setOpen(true);
		}
	};

	const setToggleButton = (nav) => {
		switch (nav) {
			case mapObjectSelection.Pointer:
				setSelected('arrow');
				break;
			case mapObjectSelection.User:
				setSelected('user');
				break;
			case mapObjectSelection.Junction:
				setSelected('junction');
				break;
			case mapObjectSelection.Link:
				setSelected('link');
				break;
			case mapObjectSelection.NewMap:
				setSelected('new');
				break;
			case mapObjectSelection.PublishMap:
				setSelected('pubplish');
				break;
			default:
				setSelected('arrow');
		}
	};

	const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
		setSelected(newValue);

		switch (newValue) {
			case 'user':
				dispatch(navActions.navSelection(mapObjectSelection.User));
				break;
			case 'junction':
				dispatch(navActions.navSelection(mapObjectSelection.Junction));
				break;
			case 'link':
				dispatch(navActions.navSelection(mapObjectSelection.Link));
				break;
			case 'arrow':
				dispatch(navActions.navSelection(mapObjectSelection.Pointer));
				break;
			case 'publishmap':
				dispatch(navActions.navSelection(mapObjectSelection.PublishMap));
				break;
			case 'new':
				dispatch(navActions.navSelection(mapObjectSelection.NewMap));
				break;
			default:
				dispatch(navActions.navSelection(mapObjectSelection.Pointer));
				break;
		}
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar variant="dense">
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						ULTIMUS
					</Typography>
					<ToggleButtonGroup
						size="small"
						value={selected}
						className={classes.buttonRoot}
						onChange={handleChange}
						exclusive
					>
						<ToggleButton value="arrow">
							<img src={CURSOR} width="36" height="36" alt="" />
						</ToggleButton>
						<ToggleButton value="link">
							<img src={LINK} width="36" height="36" alt="" />
						</ToggleButton>
						<ToggleButton value="user">
							<img src={USER_STEP} width="36" height="36" alt="" />
						</ToggleButton>
						<ToggleButton value="maplet">
							<img src={MAPLET} width="36" height="36" alt="" />
						</ToggleButton>
						<ToggleButton value="junction">
							<img src={JUNCTION} width="36" height="36" alt="" />
						</ToggleButton>
					</ToggleButtonGroup>
					<Divider flexItem orientation="vertical" className={classes.divider} />
					<ToggleButtonGroup size="small" value={gridSelected} onChange={handleChange2} exclusive>
						<ToggleButton size="small" value={1} selected={gridSelected > 0 ? true : false}>
							<img src={GRID} width="36" height="36" alt="" />
						</ToggleButton>
						<ToggleButton
							size="small"
							value={2}
							selected={false}
							disabled={gridSelected === 0 ? true : false}
						>
							<img src={SNAPTO} width="36" height="36" alt="" />
						</ToggleButton>
					</ToggleButtonGroup>
				</Toolbar>
			</AppBar>
			{/*<Popper
				open={open}
				id="popper"
				//anchorEl={anchorEl}
				style={{ position: 'fixed', top: 70, left: 1500, width: 300, height: 200 }}
				transition={true}
				placement="right-end"
			>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={350}>
						<Paper elevation={3}>
							<ToggleButtonGroup
								size="small"
								value={selected}
								onChange={handleChange}
								exclusive
								className={classes.popper}
							>
								<ToggleButton value="arrow">
									<img src={CURSOR} width="36" height="36" alt="" />
								</ToggleButton>
								<ToggleButton value="link">
									<img src={LINK} width="36" height="36" alt="" />
								</ToggleButton>
								<ToggleButton value="user">
									<img src={USER_STEP} width="36" height="36" alt="" />
								</ToggleButton>
								<ToggleButton value="maplet">
									<img src={MAPLET} width="36" height="36" alt="" />
								</ToggleButton>
								<ToggleButton value="junction">
									<img src={JUNCTION} width="36" height="36" alt="" />
								</ToggleButton>
							</ToggleButtonGroup>
							<Divider flexItem orientation="horizontal" />
							<ToggleButtonGroup
								size="small"
								value={gridSelected}
								onChange={handleChange2}
								exclusive
								className={classes.popper}
							>
								<ToggleButton size="small" value={1} selected={gridSelected > 0 ? true : false}>
									<img src={GRID} width="36" height="36" alt="" />
								</ToggleButton>
								<ToggleButton
									size="small"
									value={2}
									selected={false}
									disabled={gridSelected === 0 ? true : false}
								>
									<img src={SNAPTO} width="36" height="36" alt="" />
								</ToggleButton>
							</ToggleButtonGroup>
						</Paper>
					</Fade>
				)}
				</Popper>*/}
  
		</div>
	);
}
/*import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "../actions/mapViewActions";
import * as navActions from "../actions/navActions";
import "./Toolbar.css";
import { USER_STEP, JUNCTION } from "./MapImages";
import { mapObjectSelection } from "./constant";

class Toolbar extends React.Component<any> {
  onMouseDown = (event: any) => {
    // let header: HTMLElement | null = document.getElementById("toolbarButtonDiv");
    // if (header != null)
    // {
    //     var btns = header.getElementsByClassName("mat-button-toggle-label-content");
    //     for (var i = 0; i < btns.length; i++) {
    //         btns[i].addEventListener("click", function() {
    //             var current = document.getElementsByClassName("mat-button-toggle-checked");
    //             current[0].className = current[0].className.replace(" mat-button-toggle-checked", "");
    //             this.className += " mat-button-toggle-checked";
    //         });
    //     }
    // }
    // const { nav } = this.props;
    // let checked = document.getElementById("mousePointer");
    // nav.selection = checked.className === "mat-button-toggle-label-content mat-button-toggle-checked" ? 1 : 2;
  };

  selectMousePointer = () => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("mousePointer");
    if (element != null) element.className += " mat-button-toggle-checked";
  };

  onMousePointerClicked = (event: any) => {
    this.selectMousePointer();
    this.setNavSelectiom(mapObjectSelection.Pointer);
  };

  onLinkedClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("link");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.Link);
  };

  onUserStepClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("userStep");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.User);
  };

  onJunctionStepClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("junctionStep");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.Junction);
  };

  onPublishMapClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("publishMap");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.PublishMap);

    const { map } = this.props;

    this.props.actions.mapActions.saveMap(map);

    setTimeout(() => {
      this.setNavSelectiom(mapObjectSelection.Pointer);
    }, 1000);
  };

  onNewMapClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("newMap");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.NewMap);
  };

  setNavSelectiom = (sel: any) => {
    const { nav } = this.props;

    if (nav !== sel) {
      this.props.actions.navActions.navSelection(sel);
    }
  };

  render() {
    return (
      <nav id="header" className="header noselect">
        <a className="logo white">Ultimus</a>
        <div
          id="toolbarButtonDiv"
          className="navbar-header mat-button-toggle-group mat-button-toggle-standalone"
        >
          <div
            id="mousePointer"
            className="mat-button-toggle-label-content mat-button-toggle-checked"
            onClick={this.onMousePointerClicked}
          >
            <i className="fa fa-mouse-pointer" />
          </div>
          <div
            id="newMap"
            className="mat-button-toggle-label-content"
            onClick={this.onNewMapClicked}
          >
            <i className="fa fa-file" />
          </div>
          <div
            id="link"
            className="mat-button-toggle-label-content"
            onClick={this.onLinkedClicked}
          >
            <i className="fa fa-link" />
          </div>
          <div
            id="userStep"
            className="mat-button-toggle-label-content"
            onClick={this.onUserStepClicked}
          >
            <img src={USER_STEP} width="24" height="24" alt="" />
          </div>
          <div
            id="junctionStep"
            className="mat-button-toggle-label-content"
            onClick={this.onJunctionStepClicked}
          >
            <img src={JUNCTION} width="24" height="24" alt="" />
          </div>
          <div
            id="publishMap"
            className="mat-button-toggle-label-content"
            onClick={this.onPublishMapClicked}
          >
            <i className="fa fa-globe" />
          </div>
        </div>
      </nav>
    );
  }
}

const unSelectButton = () => {
  var current = document.getElementsByClassName("mat-button-toggle-checked");
  for (var i = 0; i < current.length; i++) {
    current[i].className = current[i].className.replace(
      " mat-button-toggle-checked",
      ""
    );
  }
};

const setSelection = (sel: any) => {
  unSelectButton();
  let element = null;
  switch (sel) {
    case mapObjectSelection.User:
      element = document.getElementById("userStep");
      break;
    case mapObjectSelection.Junction:
      element = document.getElementById("junctionStep");
      break;
    case mapObjectSelection.Link:
      element = document.getElementById("link");
      break;
    case mapObjectSelection.Pointer:
      element = document.getElementById("mousePointer");
      break;
    case mapObjectSelection.PublishMap:
      element = document.getElementById("publishMap");
      break;
    case mapObjectSelection.NewMap:
      element = document.getElementById("newMap");
      break;
    default:
      element = document.getElementById("mousePointer");
      break;
  }

  if (element !== null) element.className += " mat-button-toggle-checked";
};

const mapStateToProps = (state: any, ownProps: any) => {
  setSelection(state.nav);
  return {
    map: state.data.map,
    nav: state.nav
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
*/
