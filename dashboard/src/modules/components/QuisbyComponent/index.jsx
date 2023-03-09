import "./index.less";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getQuisbyResults } from "actions/overviewActions";
import { useParams } from "react-router-dom";

const QuisbySheetComponent = () => {
  const { quisbyDoc } = useSelector((state) => state.overview);
  const dispatch = useDispatch();
  const { datasetName, datasetId } = useParams();
  // const docLink = "https://docs.google.com/spreadsheets/d/1KT75dJmD5kQGNWqzqK1_ioxG08XkpxeiuJ8PvUFz7so/edit#gid=2"
  useEffect(() => {
    if (!quisbyDoc) {
      dispatch(getQuisbyResults(datasetName, datasetId));
    }
  }, [dispatch, quisbyDoc]);
  return (
    <div className="quisby-main-container">
      <center className="quisby-sheet-wrapper">
        <iframe
          title="quisby-sheet"
          className="quisby-iframe"
          src={quisbyDoc}
        ></iframe>
      </center>
    </div>
  );
};

export default QuisbySheetComponent;
