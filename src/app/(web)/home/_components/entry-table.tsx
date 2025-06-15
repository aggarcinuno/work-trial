"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { EntryFormSchema } from "@/lib/form/entry-form-schema";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteEntry } from "@/lib/hooks/use-delete-entry";
import { StatusTag } from "./status-tag";

type Entry = z.infer<typeof EntryFormSchema>;

const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const subject = row.getValue("subject") as string;
      const getSubjectColor = (subject: string) => {
        switch (subject) {
          case "geometry":
            return "bg-blue-500";
          case "math":
            return "bg-red-500";
          case "biology":
            return "bg-green-500";
          case "physics":
            return "bg-purple-500";
          case "chemistry":
            return "bg-yellow-500";
          default:
            return "bg-gray-500";
        }
      };

      const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${getSubjectColor(subject)}`}
            />
            <span>
              {subject ? capitalizeFirstLetter(subject) : "Uncategorized"}
            </span>
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="w-[250px]">
        <p className="text-sm text-gray-700 line-clamp-4 overflow-hidden text-ellipsis whitespace-pre-wrap">
          {row.getValue("question")}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: "Diagram",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image");
      return imageUrl ? (
        <img
          src={imageUrl as string}
          alt="Diagram"
          className="w-20 h-20 object-cover rounded-md"
        />
      ) : (
        <span className="text-gray-400">No diagram</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "submitted" | "in_progress";
      return <StatusTag status={status} />;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      return date
        ? format(new Date(date as string), "MMM d, yyyy h:mm a")
        : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original;
      const { deleteEntry, isDeletingEntry } = useDeleteEntry();

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (entry.entry_id) {
              deleteEntry(entry.entry_id);
            }
          }}
          disabled={isDeletingEntry}
          className="p-2 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
        </button>
      );
    },
  },
];

export function EntryTable({ entries }: { entries: Entry[] }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`text-gray-900 border-b ${
                      index === 0 ? "pl-4" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => router.push(`/home/${row.original.entry_id}`)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`border-b ${index === 0 ? "pl-4" : ""}`}
                    >
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Rows per page • {entries.length} total entries
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
