import AnalysisReducer from "./analysisReducer";
import AuthReducer from "./authReducer";
import DatasetListReducer from "./datasetListReducer";
import EndpointReducer from "./endpointReducer";
import LoadingReducer from "./loadingReducer";
import NavbarReducer from "./navbarReducer";
import OverviewReducer from "./overviewReducer";
import TableOfContentReducer from "./tableOfContentReducer";
import ToastReducer from "./toastReducer";
import UserProfileReducer from "./userProfileReducer";
import { combineReducers } from "redux";

export default combineReducers({
  toastReducer: ToastReducer,
  loading: LoadingReducer,
  userAuth: AuthReducer,
  userProfile: UserProfileReducer,
  navOpen: NavbarReducer,
  datasetlist: DatasetListReducer,
  apiEndpoint: EndpointReducer,
  overview: OverviewReducer,
  tableOfContent: TableOfContentReducer,
  analysis: AnalysisReducer,
});
