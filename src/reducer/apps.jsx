import initialState from './initialState';
import reducersGenerate from './reducerGenerator';

const REQUESTAPPS = 'REQUESTAPPS';

export default reducersGenerate(REQUESTAPPS, initialState.apps);