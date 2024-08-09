import { ColumnDef } from "@tanstack/react-table"
import { User } from "../data/schemas"
import { DataTableColumnHeader } from "../components/data-table-column-header"
// import { DataTableRowActions } from "../components/data-table-row-actions"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("id")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("username")}
          </span>
        </div>
      );
    },
    
  },
  {
    accessorKey: "emailAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("emailAddress")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("lastname")}</div>,
 
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("firstname")}</div>,

  },
  {
    accessorKey: "middlename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Middlename" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("middlename")}</div>,

  },
  {
    accessorKey: "suffix",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Suffix" />
    ),
    cell: ({ row }) => <div className="w-[20px]">{row.getValue("suffix")}</div>,

  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("contactNumber")}</div>,

  },
  {
    id: "actions",
  
    // cell: () => <DataTableRowActions />,
  },
]