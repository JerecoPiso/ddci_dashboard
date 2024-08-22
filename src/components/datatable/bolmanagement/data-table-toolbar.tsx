import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/datatable/components/data-table-view-options";
import { statuses } from "../data/data";

// import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onChangeFilter: (filter: string) => void;
  onFilterStatus: (status: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  onChangeFilter,
  onFilterStatus
}: DataTableToolbarProps<TData>) {
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const isFiltered = table.getState().columnFilters.length > 0;
  const handlefilter = (filter: string) => {
    setFilter(filter);
    onChangeFilter(filter);
  };
  const handleStatus = (_status: string) => {
    setStatus(_status);
    onFilterStatus(_status)
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
      <Input
          placeholder="Filter name..."
         
          value={
            (table.getColumn("document")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("document")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Input
          placeholder="Filter name..."
          value={filter}
          onChange={(event) => handlefilter(event.target.value)}
        
          className="h-8 w-[150px] lg:w-[250px] hidden"
        />
       
        <Select
          value={status}
          onValueChange={(value) => {
            handleStatus(value);
          }}
        >
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="ALL" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={`${status.value}`}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            {/* <Cross2Icon className="ml-2 h-4 w-4" /> */}
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
