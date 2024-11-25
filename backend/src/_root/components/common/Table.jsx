import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomPagination from "../../pages/CustomPagination";

const Table = ({
  rowData,
  colDefs,
  onGridReady,
  onSortChanged,
  onFilterChanged,
  gridApiRef,
  paginationChangedEvent,
  totalRecords
}) => {

let width = 100

const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
};

const onGridSizeChanged = (params) => {
    let columnCount = params.columnApi.api.columnModel.gridColumns.length
    width = params.clientWidth / columnCount
    params.api.sizeColumnsToFit();
};

  return (
      <>
          <div className="overflow-x-auto">
              <div className="ag-theme-quartz" style={{ height: '64vh' }}>
                  <AgGridReact
                      rowData={rowData}
                      columnDefs={colDefs}
                      onGridReady={onGridReady}
                      onSortChanged={onSortChanged}
                      onFilterChanged={onFilterChanged}
                      paginationPageSize={10}
                      onFirstDataRendered={onFirstDataRendered}
                      onGridSizeChanged={onGridSizeChanged}
                  />
              </div>
          </div>
          <CustomPagination
              api={gridApiRef}
              totalRecords={totalRecords}
              pageSize={10}
              click={paginationChangedEvent}
          />
      </>
  );
};

export default Table;
