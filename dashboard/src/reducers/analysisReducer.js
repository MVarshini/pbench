import * as TYPES from "../actions/types";

const initialState = {
  testNames: [],
  testData: [],
  chartData: {},
};

const AnalysisReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case TYPES.GET_TESTS_NAMES:
      return {
        ...state,
        testNames: payload,
      };
    case TYPES.GET_TEST_DATA:
      return {
        ...state,
        testData: payload,
      };
    case TYPES.SET_CHART_DATA:
      return {
        ...state,
        chartData: payload,
      };
    default:
      return state;
  }
};

export default AnalysisReducer;
