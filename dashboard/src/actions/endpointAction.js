import * as TYPES from "./types";

export const fetchEndpoints = () => async (dispatch) => {
    const response = await fetch ("/api/v1/endpoints");

    if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
    //window.endpoints = (data);
    dispatch({
        type: TYPES.SET_ENDPOINTS,
        payload: {...data}
    })
}