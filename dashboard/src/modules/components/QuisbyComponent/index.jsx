import "./index.less";

import React from "react";
import { useSelector } from "react-redux";

const QuisbySheetComponent = () => {
  const { quisbyDoc } = useSelector((state) => state.overview);
  // const docLink = "https://docs.google.com/spreadsheets/d/1KT75dJmD5kQGNWqzqK1_ioxG08XkpxeiuJ8PvUFz7so/edit#gid=2"
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
