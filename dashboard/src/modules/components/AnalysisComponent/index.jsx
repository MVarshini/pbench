import "./index.less";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
} from "@patternfly/react-core";
import React, { useEffect, useState } from "react";

import { downloadFile } from "actions/analysisActions";

export const CustomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };
  const onFocus = () => {
    const element = document.getElementById("toggle-basic");
    element.focus();
  };
  const dropdownItems = [
    <DropdownItem key="vm1">VM 1</DropdownItem>,
    <DropdownItem key="vm2">VM 2</DropdownItem>,
  ];
  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };
  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle id="toggle-basic" onToggle={onToggle}>
          DropDown
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};

const AnalysisComponent = () => {
  useEffect(() => {}, []);
  return (
    <div className="analysis-container">
      <div className="header">
        <div className="header-left">
          <div className="header-item">
            <div className="item-name">VM Name: </div>
            <CustomDropdown />
          </div>
          <div className="header-item">
            <div className="item-name">Port: </div>
            <CustomDropdown />
          </div>
          <div className="header-item">
            <div className="item-name">Chart Type: </div>
            <CustomDropdown />
          </div>
        </div>
        <div className="header-right">
          <div className="header-item">
            <Button onClick={downloadFile("excel")}>Download in excel</Button>
            <Button onClick={downloadFile("pdf")}>Download in pdf</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisComponent;
