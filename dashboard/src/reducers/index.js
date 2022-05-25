import { combineReducers } from 'redux';
import ToastReducer from "./toastReducer";
import LoadingReducer from "./loadingReducer";
import EndpointReducer from './endpointReducer';

export default combineReducers({
    toastReducer: ToastReducer,
    loading: LoadingReducer,
    endpoint: EndpointReducer,
})