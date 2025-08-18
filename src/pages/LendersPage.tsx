import { useMemo, useRef, useState } from "react";
import "../App.css";
import { lendersUsersData } from "../Datastore";

import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  colorSchemeLightWarm,
  themeQuartz,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

function LendersPage() {
  const [rowData] = useState(lendersUsersData);

  const [colDefs] = useState([
    { field: "lender", headerName: "Lender" },
    { field: "user", headerName: "User" },
    { field: "product", headerName: "Product" },
  ]);
  const gridRef = useRef<AgGridReact>(null);

  const myTheme = themeQuartz.withPart(colorSchemeLightWarm).withParams({
    backgroundColor: "#f9f9faff",
    foregroundColor: "#101010ff",
    headerBackgroundColor: "#f9f9faff",
    rowHoverColor: "rgba(207, 206, 206, 1)",
  });

  const defaultColDef = useMemo(
    () => ({
      editable: true,
      filter: true,
    }),
    []
  );

  return (
    <div className="table" style={{ height: 500 }}>
      <h2 className="text-2xl font-bold mb-2">Mortgage Lenders & Users</h2>
      <AgGridReact
        theme={myTheme}
        ref={gridRef}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        // quickFilterText={searchText}
        rowData={rowData}
        autoSizeStrategy={{
          type: "fitGridWidth",
          defaultMinWidth: 100,
          columnLimits: [{ colId: "lender", minWidth: 150 }],
        }}
        pagination={true}
        paginationAutoPageSize={true}
        paginationPageSizeSelector={true}
      />
    </div>
  );
}

export default LendersPage;
