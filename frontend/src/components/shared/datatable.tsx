"use client";

import { DataTableProps } from "@/types/ui-props";
import React from "react";

export const DataTable = <T extends { id: string | number }>({
        data,
        columns,
        emptyStateMessage = "No data found.",
        onRowClick,
        isLoading = false,
}: DataTableProps<T>) => {
        return (
                <table className="min-w-full border border-secondary/20 rounded-lg text-[12px]">
                        <thead className="border-b border-secondary/20 bg-accent">
                                <tr>
                                        {columns.map((column, index) => (
                                                <th
                                                        key={column.header}
                                                        className={`px-4 py-3 text-left ${index >= 2 ? "hidden lg:table-cell" : ""
                                                                }`}
                                                >
                                                        {column.header}
                                                </th>
                                        ))}
                                </tr>
                        </thead>

                        <tbody className="divide-y divide-secondary/20 text-foreground">
                                {isLoading ? (
                                        <tr>
                                                <td
                                                        colSpan={columns.length}
                                                        className="text-center px-4 py-6 text-sm text-muted-foreground"
                                                >
                                                        Loading...
                                                </td>
                                        </tr>
                                ) : data.length > 0 ? (
                                        data.map((row) => (
                                                <tr
                                                        key={row.id}
                                                        className={`hover:bg-muted transition ${onRowClick ? "cursor-pointer" : "lg:cursor-default"
                                                                }`}
                                                        onClick={() => onRowClick?.(row)}
                                                >
                                                        {columns.map((column, index) => (
                                                                <td
                                                                        key={`${row.id}-${column.header}`}
                                                                        className={`px-4 py-3 ${index >= 2 ? "hidden lg:table-cell" : ""
                                                                                }`}
                                                                >
                                                                        {column.cell
                                                                                ? column.cell(row)
                                                                                : column.accessorKey
                                                                                        ? (row[column.accessorKey] as React.ReactNode)
                                                                                        : null}
                                                                </td>
                                                        ))}
                                                </tr>
                                        ))
                                ) : (
                                        <tr>
                                                <td
                                                        colSpan={columns.length}
                                                        className="text-center px-4 py-4 text-muted-foreground"
                                                >
                                                        {emptyStateMessage}
                                                </td>
                                        </tr>
                                )}
                        </tbody>
                </table>
        );
};
