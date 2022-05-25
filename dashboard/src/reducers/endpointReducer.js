import { SET_ENDPOINTS} from "../actions/types";

const initialState = {
    data: {}
}

const EndpointReducer = (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch (type) {
        case SET_ENDPOINTS:
            return {
                ...state,
                data: Object.assign({}, payload)
            }
        default:
            return state;
    }
}

export default EndpointReducer;