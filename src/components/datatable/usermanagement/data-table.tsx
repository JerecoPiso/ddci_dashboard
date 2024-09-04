/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableRowActions } from "../components/data-table-row-actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, TriangleAlert } from "lucide-react";
import { BaseUrlContext } from "@/App";
import axios from "axios";
import Cookies from "js-cookie";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addUser: () => void;
  onDelete: (id: any, username: any) => void;
  onUpdate: (userInfo: any) => void;
  clients: [];
  updateClient: () => void
}
export function DataTable<TData, TValue>({
  columns,
  data,
  addUser,
  onDelete,
  onUpdate,
  clients,
  updateClient,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const baseUrl = React.useContext(BaseUrlContext);
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const handleAddUser = () => {
    addUser();
  };
 
  const handleDelete = (values: any) => {
    onDelete(values.id, values.username);
    // console.log(values.id)
  };
  const handleUpdate = (values: any) => {
    onUpdate(values);
  };
  const isClientChecked = (value: string) => selectedClients.includes(value);
  const handleClients = (value: string) => {
    setSelectedClients((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((option) => option !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };
  const ToastError = (message: string) => {
    toast("Error!", {
      style: { color: "red", backgroundColor: "#ffeae4" },
      className: "my-classname",
      description: message,
      duration: 3000,
      icon: <TriangleAlert className="w-5 h-5" />,
      closeButton: false,
    });
  };
  const ToastSuccess = (message: string) => {
    toast("Success", {
      style: { color: "#009900", backgroundColor: "white" },
      className: "my-classname",
      description: message,
      duration: 3000,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      closeButton: false,
    });
  };
  const updateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenEditModal(true)
    table.getSelectedRowModel().rows.forEach(async (el: any) => {
      const data = {
        id: el.original.id,
        username: el.original.username,
        firstname: el.original.firstname,
        lastname: el.original.lastname,
        emailAddress: el.original.emailAddress,
        contactNumber: el.original.contactNumber,
        authorities: el.original.authorities.split(','),
        clients: selectedClients,
      };
      if(selectedClients.length === 0) {
        ToastError("Clients cannot be empty!");
      } else {
        try {
          const response = await axios.post(`${baseUrl}credential/update`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
          if (response.status === 200) {
            ToastSuccess(response.data.message);
            table.resetRowSelection()
            updateClient()
            setSelectedClients([])
            setOpenEditModal(false);
          } else {
            ToastError("Something went wrong!");
          }
        } catch (err: any) {
          ToastError(JSON.stringify(err.response.data.details));
        }
      }
    });
  };
  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        addUser={handleAddUser}
        editClient={() => table.getSelectedRowModel().rows.length > 0 ?  setOpenEditModal(true) :  ToastError("Please select user/s to update client!")}
      />
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-[568px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={updateUser}>
            <div className="grid grid-cols-2 gap-2">
              <div className="md:col-span-2 col-span-2">
                <Label>Clients</Label>
                <div className="flex flex-wrap gap-x-4">
                  {clients.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={isClientChecked(option)}
                        onChange={() => handleClients(option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-red-800 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-red-800/90 mt-2 dark:text-slate-300"
            >
              UPDATE
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id}>
                      {/* {JSON.stringify(cell.row.original)} */}
                      {index === 10 ? (
                        <DataTableRowActions
                          onDelete={() => handleDelete(cell.row.original)}
                          onUpdate={() => handleUpdate(cell.row.original)}
                        />
                      ) : (
                        ""
                      )}
                      {/* <DataTableRowActions /> */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
