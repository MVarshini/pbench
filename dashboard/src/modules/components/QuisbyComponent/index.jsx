import "./index.less";

import React from "react";

const QuisbySheetComponent = () => {
  return (
    <div className="quisby-main-container">
      <center className="quisby-sheet-wrapper">
        <iframe
          title="quisby-sheet"
          className="quisby-iframe"
          src="https://docs.google.com/spreadsheets/d/1KT75dJmD5kQGNWqzqK1_ioxG08XkpxeiuJ8PvUFz7so/edit#gid=2"
        ></iframe>
      </center>
    </div>
  );
};

export default QuisbySheetComponent;
