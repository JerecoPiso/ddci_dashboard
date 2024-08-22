/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { statuses } from "../data/data";
import { Bol } from "@/components/datatable/data/schemas";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
export const columns: ColumnDef<Bol>[] = [
  {
    accessorKey: "document",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Document" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("document")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("type")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "production",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Production" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("production")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "pages",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pages" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("pages")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );
      if (!status) {
        return null;
      }
      return (
        <div className="flex items-center">
          <span>{row.getValue("status")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "elapse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Elapse" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("elapse")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "turnaroundtime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Turn Around Time" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("turnaroundtime")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "accuracy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accuracy" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("accuracy")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("priority") == 1 ? (
              <Badge variant="outline">{row.getValue("priority")}</Badge>
            ) : (
              <Badge variant="destructive">{row.getValue("priority")}</Badge>
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("createdat")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
  
    // cell: () => <DataTableRowActions />,
  },
];
