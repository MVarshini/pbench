import * as TYPES from "./types";
import { logout } from "./authActions";

export const showSessionExpired = () => async (dispatch) => {
  let toast = {
    variant: "danger",
    title: "Session Expired",
    message: "Please login to continue",
  };
  dispatch({
    type: TYPES.SHOW_TOAST,
    payload: { ...toast },
  });
  dispatch(logout());
};

export const showFailureToast = () => async (dispatch) => {
  let toast = {
    variant: "danger",
    title: "Something went wrong",
    message: "Please try again later",
  };
  dispatch({
    type: TYPES.SHOW_TOAST,
    payload: { ...toast },
  });
}

export const constructToast = (variant, title, message ="") => async(dispatch) => {
  dispatch({
    type: TYPES.SHOW_TOAST,
    payload: { variant, title, message },
  });
}
