import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { CURSOR, USER_STEP, JUNCTION, MAPLET } from './MapImages';

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
		}
	})
);

export default function ButtonAppBar() {
	const classes = useStyles();
	const [ selected, setSelected ] = React.useState('arrow');

	const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
		setSelected(newValue);
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
						exclusive
						onChange={handleChange}
					>
						<ToggleButton value="arrow">
							<img src={CURSOR} width="36" height="36" alt="" />
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
				</Toolbar>
			</AppBar>
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
