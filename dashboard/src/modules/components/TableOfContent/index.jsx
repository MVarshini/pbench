import "./index.less";

import {
  AngleLeftIcon,
  DownloadIcon,
  FolderIcon,
} from "@patternfly/react-icons";
import {
  BadgeToggle,
  Breadcrumb,
  BreadcrumbHeading,
  BreadcrumbItem,
  Divider,
  DrilldownMenu,
  Dropdown,
  DropdownItem,
  Menu,
  MenuBreadcrumb,
  MenuContent,
  MenuItem,
  MenuList,
} from "@patternfly/react-core";
import React, { useEffect, useState } from "react";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import {
  fetchTOC,
  updateContentData,
  updateCurrData,
  updateSearchSpace,
  updateStack,
  updateTableData,
} from "actions/tableOfContentActions";
import { useDispatch, useSelector } from "react-redux";

import { DEFAULT_PER_PAGE } from "assets/constants/paginationConstants";
import { EmptyTable } from "../TableComponent/common-components";
import { SearchTOC } from "./common-components";
import TablePagination from "../PaginationComponent";
import { useParams } from "react-router";

const TableOfContent = () => {
  const { endpoints } = useSelector((state) => state.apiEndpoint);
  const [menuDrilledIn, setMenuDrilledIn] = useState([]);
  const [drilldownPath, setDrillDownPath] = useState([]);
  const [activeMenu, setActiveMenu] = useState("rootMenu");
  const [breadCrumb, setBreadCrumb] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [breadCrumbLabels, setBreadCrumbLabels] = useState([]);
  const [param, setParam] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
  const params = useParams();
  const dispatch = useDispatch();
  let dirCount = 0;
  let fileCount = 0;
  useEffect(() => {
    if (Object.keys(endpoints).length > 0)
      dispatch(fetchTOC(params["dataset_id"], "", false));
  }, [dispatch, endpoints, params]);
  const { stack, searchSpace, tableData, contentData, currData } = useSelector(
    (state) => state.tableOfContent
  );
  const setTableData = (data) => {
    dispatch(updateTableData(data));
  };
  const setContnetData = (data) => {
    dispatch(updateContentData(data));
  };
  const setSearchSpace = (data) => {
    dispatch(updateSearchSpace(data));
  };
  const setStack = (length) => {
    dispatch(updateStack(length));
  };
  const setCurrData = (data) => {
    dispatch(updateCurrData(data));
  };

  const onToggle = (isOpen, key, moreBreadCrumbs) => {
    if (key === "app") {
      setBreadCrumb(appGroupingBreadcrumb(isOpen, moreBreadCrumbs));
    }
  };

  const visibleTableFiles = tableData
    ? tableData.slice((page - 1) * perPage, page * perPage)
    : [];
  const drillOut = (toMenuId, fromPathId, newBreadCrumb) => {
    const indexOfMenuId = menuDrilledIn.indexOf(toMenuId);
    const menuDrilledInSansLast = menuDrilledIn.slice(0, indexOfMenuId);
    const indexOfMenuIdPath = drilldownPath.indexOf(fromPathId);
    const pathSansLast = drilldownPath.slice(0, indexOfMenuIdPath);
    setMenuDrilledIn(menuDrilledInSansLast);
    setDrillDownPath(pathSansLast);
    setActiveMenu(toMenuId);
    setBreadCrumb(newBreadCrumb);
  };
  const drillIn = (fromMenuId, toMenuId, pathId) => {
    setMenuDrilledIn([...menuDrilledIn, fromMenuId]);
    setDrillDownPath([...drilldownPath, pathId]);
    setActiveMenu(toMenuId);
  };
  const getDropDown = (moreBreadCrumbs) => {
    const dropDownArray = moreBreadCrumbs.map((label, index) =>
      index < moreBreadCrumbs.length - 1 ? (
        <DropdownItem
          key="dropdown-start"
          component="button"
          icon={<AngleLeftIcon />}
          onClick={() => {
            setStack(index + 2);
            const updatedBreadCrumbLabels = breadCrumbLabels.slice(
              0,
              index + 1
            );
            const newParam = param.split("/");
            setParam(newParam.slice(0, index + 1).join("/"));
            setBreadCrumbLabels(updatedBreadCrumbLabels);
            setCurrData(stack[index + 1]);
            setTableData(stack[index + 1].files);
            setSearchSpace(stack[index + 1].files);
            if (updatedBreadCrumbLabels.length === 1) {
              setBreadCrumb(initialBreadcrumb(updatedBreadCrumbLabels));
            } else if (updatedBreadCrumbLabels.length > 1)
              setBreadCrumb(
                appGroupingBreadcrumb(false, updatedBreadCrumbLabels)
              );
          }}
        >
          {label}
        </DropdownItem>
      ) : (
        <></>
      )
    );
    dropDownArray.pop();
    return dropDownArray;
  };
  const initialBreadcrumb = (initial) => (
    <Breadcrumb>
      <BreadcrumbItem component="button" onClick={getMyBreadCrumbClick}>
        Root
      </BreadcrumbItem>
      <BreadcrumbHeading component="button">
        {initial.length > 0 ? initial[0] : ""}
      </BreadcrumbHeading>
    </Breadcrumb>
  );

  const appGroupingBreadcrumb = (isOpen, moreBreadCrumbs) => {
    return (
      <Breadcrumb>
        <BreadcrumbItem component="button" onClick={getMyBreadCrumbClick}>
          Root
        </BreadcrumbItem>
        <BreadcrumbItem isDropdown>
          <Dropdown
            toggle={
              <BadgeToggle
                id="toggle-id"
                onToggle={(open) => onToggle(open, "app", moreBreadCrumbs)}
              >
                {moreBreadCrumbs.length - 1}
              </BadgeToggle>
            }
            isOpen={isOpen}
            dropdownItems={getDropDown(moreBreadCrumbs)}
          />
        </BreadcrumbItem>
        <BreadcrumbHeading component="button">
          {moreBreadCrumbs[moreBreadCrumbs.length - 1]}
        </BreadcrumbHeading>
      </Breadcrumb>
    );
  };
  const getMyBreadCrumbClick = () => {
    drillOut("rootMenu", "group:start_rollout", initialBreadcrumb([]));
    setStack(1);
    setTableData(stack[0].files);
    setContnetData(stack[0]);
    setSearchSpace(stack[0].files);
    setParam("");
    setBreadCrumbLabels([]);
  };
  const getSubFolderData = (data) => {
    dispatch(fetchTOC(params["dataset_id"], data, true));
  };
  const attachBreadCrumbs = (data, firstHierarchyLevel) => {
    setBreadCrumbLabels([...breadCrumbLabels, data.name]);

    setBreadCrumb(
      firstHierarchyLevel
        ? initialBreadcrumb(breadCrumbLabels)
        : appGroupingBreadcrumb(false, breadCrumbLabels)
    );
    const dirPath = param.concat(firstHierarchyLevel ? "" : "/", data.name);
    setParam(dirPath);
    getSubFolderData(data.uri);
  };
  const updateHighlightedRow = (index) => {
    const newPage = Math.floor(index / perPage);
    if (newPage + 1 !== page) {
      setPage(newPage + 1);
    }
    setActiveFile(index);
  };

  return (
    <>
      <div className="toc">
        <Menu
          id="rootMenu"
          containsDrilldown
          drilldownItemPath={drilldownPath}
          drilledInMenus={menuDrilledIn}
          activeMenu={activeMenu}
          onDrillIn={drillIn}
          onDrillOut={drillOut}
        >
          {breadCrumb && (
            <>
              <MenuBreadcrumb>{breadCrumb}</MenuBreadcrumb>
              <Divider component="li" />
            </>
          )}

          <MenuContent>
            <MenuList>
              {contentData?.directories?.map((data, index) => {
                return (
                  <MenuItem
                    itemId="group:start_rollout"
                    id="d_down_parent"
                    key={index}
                    icon={<FolderIcon aria-hidden />}
                    direction="down"
                    onClick={() => {
                      attachBreadCrumbs(data, true);
                    }}
                    drilldownMenu={
                      <DrilldownMenu id="drilldownMenuStart">
                        {currData?.directories?.map((data, index) => {
                          if (dirCount < currData.directories.length) {
                            dirCount = dirCount + 1;
                            return (
                              <MenuItem
                                itemId="dir_info"
                                id="d_down"
                                key={index}
                                direction="down"
                                icon={<FolderIcon aria-hidden />}
                                onClick={() => {
                                  attachBreadCrumbs(data, false);
                                }}
                              >
                                {data.name}
                              </MenuItem>
                            );
                          } else {
                            return <></>;
                          }
                        })}

                        {currData?.files?.map((data, index) => {
                          if (fileCount < currData.files.length) {
                            fileCount = fileCount + 1;
                            return (
                              <MenuItem
                                key={index}
                                icon={<FolderIcon aria-hidden />}
                                onClick={() => {
                                  updateHighlightedRow(index);
                                }}
                              >
                                {data.name}
                              </MenuItem>
                            );
                          } else {
                            return <></>;
                          }
                        })}
                      </DrilldownMenu>
                    }
                  >
                    {data.name}
                  </MenuItem>
                );
              })}
              {contentData?.files?.map((data, index) => {
                return (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      updateHighlightedRow(index);
                    }}
                  >
                    {data.name}
                  </MenuItem>
                );
              })}
            </MenuList>
          </MenuContent>
        </Menu>
        <div className="tableTOC">
          <div className="searchTOCContainer">
            <SearchTOC
              dataArray={searchSpace}
              setTableData={setTableData}
            ></SearchTOC>
          </div>
          <TableComposable
            aria-label="Simple table"
            variant="compact"
            className="tocBody"
          >
            <>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>mtime</Th>
                  <Th>Size</Th>
                  <Th>Mode</Th>
                  <Th>Type</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {visibleTableFiles.length > 0 ? (
                  visibleTableFiles?.map((file, index) => (
                    <Tr
                      key={file.name}
                      className={
                        activeFile === index + (page - 1) * perPage
                          ? "active"
                          : ""
                      }
                    >
                      <Td dataLabel={file.name}>{file.name}</Td>
                      <Td dataLabel={file.mtime}>{file.mtime}</Td>
                      <Td dataLabel={file.size}>{file.size}</Td>
                      <Td dataLabel={file.mode}>{file.mode}</Td>
                      <Td dataLabel={file.type}>{file.type}</Td>
                      <Td dataLabel={file.uri}>
                        <a
                          className="download-icon"
                          href={file.uri}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <DownloadIcon />
                        </a>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8}>
                      <EmptyTable />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </>
          </TableComposable>
          <TablePagination
            numberOfRows={tableData.length}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default TableOfContent;
