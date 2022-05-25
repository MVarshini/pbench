import React, { useEffect } from 'react';
import favicon from './assets/logo/favicon.ico';
import './App.css';
import MainLayout from "./modules/containers/MainLayout/index";
import '@patternfly/patternfly/patternfly.css';
import { fetchEndpoints } from "./actions/endpointAction"
import { useDispatch, useSelector } from 'react-redux';

function App() {  
  const dispatch = useDispatch();
  const data = useSelector(state => state.endpoint.data);
  
  useEffect(() => {
    const faviconLogo = document.getElementById("favicon");
    faviconLogo.setAttribute("href", favicon);

    dispatch(fetchEndpoints());
  }, [dispatch])

 
  return (
    <div className="App">
      <b>Pbench Dashboard for {window?.endpoints?.identification}</b>
      <div>{data?.identification}</div>
      <MainLayout />
    </div> 
  );
}

export default App;
