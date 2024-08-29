import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/datatable/components/data-table-view-options";
import { PlusCircle, EditIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  addUser: () => void;
  editClient: () => void;
}
export function DataTableToolbar<TData>({
  table,
  addUser,
  editClient,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const handleAddUser = () => {
    addUser();
  };
  const handleEditClient = () => {
    editClient();
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter lastname..."
          value={
            (table.getColumn("lastname")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("lastname")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <Button
              onClick={handleAddUser}
              className="h-[32px] px-3 bg-transparent hover:text-white dark:hover:text-slate-800 dark:text-slate-100 text-slate-800 border rounded-sm mr-1"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add User</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <Button
              onClick={handleEditClient}
              className="h-[32px] px-3 bg-transparent hover:text-white dark:hover:text-slate-800 dark:text-slate-100 text-slate-800 border rounded-sm mr-1"
            >
              <EditIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update the client of selected user/s</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DataTableViewOptions table={table} />
    </div>
  );
}
