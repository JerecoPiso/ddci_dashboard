/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Eye,
} from "lucide-react";
import { getImage, getOcrVerifiedData } from "@/services/viewBol";
import { BaseUrlContext } from "@/App";
import { ImageViewerContent } from "@/components/imageviewer/ImageViewerContent";
import JsonView from "@uiw/react-json-view";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterChange: (filter: string) => void;
  changePage: (movement: string, rowSize?: string) => void;
  onFilterStatus: (status: string) => void;
  pageCount: number;
  pageNumber: number;
}
export function DataTable<TData, TValue>({
  columns,
  data,
  filterChange,
  changePage,
  pageCount,
  pageNumber,
  onFilterStatus,
}: DataTableProps<TData, TValue>) {
  const baseUrl = useContext(BaseUrlContext);
  const [roles, setRoles] = useState<string>();

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [ocredData, setOcredData] = useState<any>(null);
  const [verifiedData, setVerifiedData] = useState<any>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [image, setImage] = useState<any>(null);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedValues, setSelectedValues] = useState<any>(null);
  const onChangeFilter = (filter: string) => {
    filterChange(filter);
  };
  const handleFilterStatus = (status: string) => {
    onFilterStatus(status);
  };
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
    pageCount: pageCount,
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
  const onChangePage = (movement: string, rowSize?: string) => {
    table.nextPage();
    changePage(movement, rowSize);
  };
  const handleViewBol = async (values: any, ifChangeImage: boolean) => {
    setPages(Number(values.pages));
    setSelectedValues(values);
    setImage(await getImage(baseUrl, values.document, currentPage));
    // if next or previous image do not toggle the sheet for viewing the bol and do not re get the datas of ocred and verified
    if (!ifChangeImage) {
      try {
        setOcredData(
          await getOcrVerifiedData(baseUrl, "get-ocr-data", values.document)
        );
      } catch (err) {
        setOcredData({});
        console.log(err);
      }
      try {
        setVerifiedData(
          await getOcrVerifiedData(
            baseUrl,
            "get-verified-data",
            values.document
          )
        );
      } catch (err) {
        setVerifiedData({});
        console.log(err);
      }

      setOpen(!open);
    }
  };
  // const getRowOriginalValue  = (values: any) => {
  //   return values.status
  // }
  const firstPage = () => {
    setCurrentPage(1);
  };
  const lastPage = () => {
    setCurrentPage(pages);
  };
  const nextImage = () => {
    if (currentPage < pages) {
      setCurrentPage((page) => page + 1);
    }
  };
  const prevImage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };
  useEffect(() => {
    if (!open) {
      setCurrentPage(1);
    }
  }, [open]);
  useEffect(() => {
    setRoles(JSON.stringify(Cookies.get("_authorities")));
    if (selectedValues != null) {
      handleViewBol(selectedValues, true);
    }
  }, [currentPage]);
  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="min-w-full min-h-full max-h-[90%]">
          <DialogHeader>
            <DialogTitle>BOL</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-x-2 max-h-[90%] overflow-auto">
            <div className="col-span-1 border">
              <div className="flex justify-center items-center space-x-2 p-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => firstPage()}
                  disabled={currentPage === 1 || pages == 0}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => prevImage()}
                  disabled={currentPage === 1 || pages == 0}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {currentPage} of {pages}
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => nextImage()}
                  disabled={currentPage === pages || pages == 0}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => lastPage()}
                  disabled={currentPage === pages || pages == 0}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <ImageViewerContent image_path={image} />
            </div>
            <div className="col-span-1 border bg-white">
              <p className="text-slate-800 font-semibold text-xl pl-2">
                OCRED DATA
              </p>
              <JsonView
                value={ocredData}
                displayDataTypes={false}
                className="max-h-[600px] overflow-auto "
              />
            </div>
            <div className="col-span-1 border bg-white">
              <p className="text-slate-800 font-semibold text-xl pl-2">
                VERIFIED DATA
              </p>
              <JsonView
                value={verifiedData}
                displayDataTypes={false}
                className="max-h-[600px] overflow-auto "
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DataTableToolbar
        table={table}
        onChangeFilter={onChangeFilter}
        onFilterStatus={handleFilterStatus}
      />
      <div className="rounded-md border min-h-[400px] max-h-[800px] overflow-auto">
        <Table>
          <TableHeader className="bg-red-800 dark:bg-slate-800 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-white hover:text-slate-800"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
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
                    // && getRowOriginalValue(cell.row.original) == 'EDITED'
                    <TableCell key={cell.id}>
                      {index === 10 &&
                      (roles?.includes("ROLE_DASHBOARD") ||
                        roles?.includes("ROLE_SYSTEM")) ? (
                        <Eye
                          onClick={() =>
                            handleViewBol(cell.row.original, false)
                          }
                        />
                      ) : (
                        ""
                      )}
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
      <DataTablePagination
        table={table}
        changePage={onChangePage}
        pageNumber={pageNumber}
        pageCount={pageCount}
      />
    </div>
  );
}
