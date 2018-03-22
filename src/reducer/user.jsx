// import { LOGIN } from './../constants/actionTypes';
import initialState from './initialState';
import reducersGenerate from './reducerGenerator';

const USER = 'USER';

export default reducersGenerate(USER, initialState.users);