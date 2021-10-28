import * as actionTypes from "../constants/actionTypes";
import * as api from "../api/index";

export const signin = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signin(formData);
    dispatch({ type: actionTypes.SIGNIN, data });
    history.push("/dashboard/coupons");
  } catch (error) {
    console.log(error);
  }
};
