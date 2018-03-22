import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {Provider} from 'react-redux';

import configureStore from './store';
import Routes from './routes';
import './index.scss';



// 将路由写成组件形式，确保可以实现热加载
class Root extends React.Component {
	render () {
		return (
      <Provider store={this.props.store}>
        <Routes history={this.props.history} />
      </Provider>
		)
	}
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
render(
  <Root history={history} store={store} />,
  document.getElementById("root")
);

if (module.hot) {
	module.hot.accept();
}