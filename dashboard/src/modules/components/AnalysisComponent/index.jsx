import "./index.less";

import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";
import React, { useEffect, useState } from "react";
import { drawChart, getTestNames } from "actions/analysisActions";
import { useDispatch, useSelector } from "react-redux";

import { BarChart } from "./ChartComponent";

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
          Bar
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};

export const CustomSelectbox = (props) => {
  const { options, className } = props;

  const selectListOptions = [];
  options.forEach((item, index) => {
    selectListOptions.push(<SelectOption key={index} value={item} />);
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };
  const clearSelection = () => {
    setIsOpen(false);
    setSelected(null);
  };
  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setIsOpen(!isOpen);
      setSelected(selection);
    }
    console.log("selected:", selection);
  };

  const customFilter = (_, value) => {
    if (!value) {
      return selectListOptions;
    }
    const input = new RegExp(value, "i");
    return selectListOptions.filter((option) => input.test(option.props.value));
  };
  return (
    <Select
      className={className}
      variant={SelectVariant.typeahead}
      typeAheadAriaLabel="Select the test"
      onToggle={onToggle}
      onSelect={onSelect}
      onClear={clearSelection}
      onFilter={customFilter}
      selections={selected}
      isOpen={isOpen}
      aria-labelledby={"Test Name"}
      placeholderText="Select the test"
    >
      {selectListOptions}
    </Select>
  );
};
export const CustomButtonDropdown = (props) => {
  const { buttonName, className } = props;
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };
  const onFocus = () => {
    const element = document.getElementById("toggle-primary");
    element.focus();
  };
  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };
  const dropdownItems = [
    <DropdownItem key="Excel">Excel</DropdownItem>,
    <DropdownItem key="pdf">PDF</DropdownItem>,
  ];
  return (
    <Dropdown
      className={className}
      onSelect={onSelect}
      toggle={
        <DropdownToggle
          id="toggle-primary"
          toggleVariant="primary"
          onToggle={onToggle}
        >
          {buttonName}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};
const AnalysisComponent = () => {
  const dispatch = useDispatch();
  const testNames = useSelector((state) => state.analysis.testNames);
  const chartData = useSelector((state) => state.analysis.chartData);
  useEffect(() => {
    dispatch(getTestNames());
    dispatch(drawChart());
  }, [dispatch]);

  return (
    <div className="analysis-container">
      <div className="header">
        <div className="header-left">
          <div className="header-item">
            <div className="item-name">Test Name: </div>
            <CustomSelectbox options={testNames} className="header-selectbox" />
          </div>
          <div className="header-item">
            <div className="item-name">Chart Type: </div>
            <CustomDropdown />
          </div>
        </div>
        <div className="header-right">
          <div className="header-item">
            <CustomButtonDropdown
              buttonName={"Download"}
              className="header-selectbox"
            />
          </div>
        </div>
      </div>
      <div>
        {Object.entries(chartData).length !== 0 &&
          chartData.constructor === Object && (
            <BarChart chartData={chartData} />
          )}
      </div>
    </div>
  );
};

export default AnalysisComponent;
