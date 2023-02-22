import * as TYPES from "./types";

import { KEYS_JOIN_BY } from "assets/constants/overviewConstants";
import store from "store/store";

const { getState } = store;

// Helper functions
const isChecked = (dataItem, checkedItems) =>
  checkedItems && checkedItems.some((item) => item === dataItem.key);
const areAllDescendantsChecked = (dataItem, checkedItems) =>
  dataItem.children
    ? dataItem.children.every((child) => child.checkProps.checked === true)
    : isChecked(dataItem, checkedItems);
const areSomeDescendantsChecked = (dataItem, checkedItems) =>
  dataItem.children
    ? dataItem.children.some((child) =>
        areSomeDescendantsChecked(child, checkedItems)
      )
    : isChecked(dataItem, checkedItems);
const setChildNodes = (childNodes, isChecked) =>
  childNodes.map((item) => {
    item.checkProps.checked = isChecked;
    return item;
  });
const getCheckedItemsKey = (item) => item.map((i) => i.key);
const getIndexofKey = (arr, key) => arr.findIndex((item) => item.key === key);
const updateChildKeysList = (checked, checkedItems, childKeys) => {
  let keysList = [];
  if (checked) {
    keysList = [...checkedItems, ...childKeys];
  } else {
    keysList = checkedItems.filter((x) => !childKeys.includes(x));
  }
  return keysList;
};

export const mapTree = (item) => {
  const checkedItems = getState().overview.checkedItems;
  const hasCheck = areAllDescendantsChecked(item, checkedItems);

  // Reset checked properties to be updated
  item.checkProps.checked = false;

  if (hasCheck) {
    item.checkProps.checked = true;
  } else {
    const hasPartialCheck = areSomeDescendantsChecked(item, checkedItems);
    if (hasPartialCheck) {
      item.checkProps.checked = null;
    }
  }

  if (item.children) {
    return {
      ...item,
      children: item.children.map((child) => mapTree(child)),
    };
  }
  return item;
};

export const onCheck =
  (evt, treeViewItem, dataType) => async (dispatch, getState) => {
    const checked = evt.target.checked;

    const treeData = getState().overview.treeData;
    let childKeys = [];
    const optionsIdx = treeData.findIndex((item) => item.title === dataType);
    const options = treeData[optionsIdx].options;
    let checkedItems = getState().overview.checkedItems;
    const keys = treeViewItem.key.split(KEYS_JOIN_BY);
    const isFirstChild = keys.length === 2;
    const isParent = "children" in treeViewItem;
    if (isParent) {
      const childNodes = treeViewItem.children;
      childKeys = getCheckedItemsKey(childNodes);
      const modifiedChildNodes = setChildNodes(childNodes, checked);
      const idx = options.findIndex((item) => keys.includes(item.name));

      if (idx > -1) {
        const childNodes = options[idx]["children"];
        const cIdx = getIndexofKey(childNodes, treeViewItem.key);
        if (cIdx > -1) {
          childNodes[cIdx]["children"] = [...modifiedChildNodes];
          childNodes[cIdx].checkProps.checked = checked;
        }
      }
      checkedItems = updateChildKeysList(checked, checkedItems, childKeys);
    } else if (isFirstChild) {
      const realOption = options.find((item) => item.id === treeViewItem.id);

      realOption.checkProps.checked = checked;
    } /* leaf node */ else {
      const parIdx = options.findIndex((i) => keys.includes(i.name));
      const parentKeys = keys.slice(0, -1);
      const childNodes = options[parIdx]["children"];
      const parentKey = parentKeys.join(KEYS_JOIN_BY);
      const childIdx = getIndexofKey(childNodes, parentKey);

      if (childIdx) {
        if ("children" in options[parIdx].children[childIdx]) {
          const subNodes = options[parIdx].children[childIdx]["children"];
          const actualNodeIdx = getIndexofKey(subNodes, treeViewItem.key);
          subNodes[actualNodeIdx].checkProps.checked = checked;
        }
      }
    }

    if (checked) {
      checkedItems.push(treeViewItem.key);
    } else {
      checkedItems = checkedItems.filter((item) => item !== treeViewItem.key);
    }
    dispatch({
      type: TYPES.SET_TREE_DATA,
      payload: treeData,
    });
    dispatch({
      type: TYPES.SET_METADATA_CHECKED_KEYS,
      payload: checkedItems.flat(),
    });
  };
