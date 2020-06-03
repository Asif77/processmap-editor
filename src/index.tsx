import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import { render } from 'react-dom';
import { configureStore } from './store/configureStore';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import { createBrowserHistory as createHistory } from 'history';
import './utils/object';
import './styles/styles.css'; //Webpack can import CSS files too!

const store = configureStore();
const history: History = createHistory();

const EVENTS_TO_MODIFY: any = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel' ];
const originalAddEventListener = document.addEventListener.bind(document);
document.addEventListener = (
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) => {
	let modOptions = options;
	if (EVENTS_TO_MODIFY.includes(type)) {
		if (typeof options === 'boolean') {
			modOptions = { capture: options, passive: false };
		} else if (typeof options === 'object') {
			modOptions = { passive: false, ...options };
		}
	}
	return originalAddEventListener(type, listener, modOptions);
};

const originalRemoveEventListener = document.removeEventListener.bind(document);
document.removeEventListener = (
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) => {
	let modOptions = options;
	if (EVENTS_TO_MODIFY.includes(type)) {
		if (typeof options === 'boolean') {
			modOptions = { capture: options, passive: false };
		} else if (typeof options === 'object') {
			modOptions = { passive: false, ...options };
		}
	}
	return originalRemoveEventListener(type, listener, modOptions);
};
render(
	<Provider store={store}>
		<Router history={history}>{routes}</Router>
	</Provider>,
	document.getElementById('root')
);
/*
store.subscribe(()=>{
  const state = store.getSate();
  if (state.map.length > 0)
  {
    console.info("Mounting app");
    render(
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  }
  else {
    console.info("App not yet mounting");
  }
});
*/

//ReactDOM.render(<App map={map} />, document.getElementById('root'));
//registerServiceWorker();

// "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
