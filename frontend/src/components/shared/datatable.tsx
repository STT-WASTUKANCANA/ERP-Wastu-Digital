// src/components/shared/DataTable.tsx
"use client";

import React from 'react';

// Tipe untuk mendefinisikan setiap kolom
export interface ColumnDef<T> {
        header: string;
        accessorKey?: keyof T;
        cell?: (row: T) => React.ReactNode;
}

// Props untuk komponen DataTable
interface DataTableProps<T> {
        data: T[];
        columns: ColumnDef<T>[];
        emptyStateMessage?: string;
        onRowClick?: (row: T) => void;
}

export const DataTable = <T extends { id: string | number }>({
        data,
        columns,
        emptyStateMessage = "No data found.",
        onRowClick,
}: DataTableProps<T>) => {

        return (
                <table className="min-w-full border border-secondary/20 rounded-lg text-[12px]">
                        <thead className="border-b border-secondary/20 bg-accent">
                                <tr>
                                        {/* 👇 MODIFIKASI DI SINI: tambahkan 'index' */}
                                        {columns.map((column, index) => (
                                                <th
                                                        key={column.header}
                                                        // Terapkan class 'hidden lg:table-cell' jika index >= 2 (kolom ke-3 dst)
                                                        className={`px-4 py-3 text-left ${index >= 2 ? 'hidden lg:table-cell' : ''}`}
                                                >
                                                        {column.header}
                                                </th>
                                        ))}
                                </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/20 text-foreground">
                                {data.length > 0 ? (
                                        data.map((row) => (
                                                <tr
                                                        key={row.id}
                                                        className={`hover:bg-muted transition ${onRowClick ? 'cursor-pointer' : 'lg:cursor-default'}`}
                                                        onClick={() => onRowClick?.(row)}
                                                >
                                                        {/* 👇 MODIFIKASI DI SINI JUGA: tambahkan 'index' */}
                                                        {columns.map((column, index) => (
                                                                <td
                                                                        key={`${row.id}-${column.header}`}
                                                                        // Terapkan class yang sama di sini untuk konsistensi
                                                                        className={`px-4 py-3 ${index >= 2 ? 'hidden lg:table-cell' : ''}`}
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
                                                <td colSpan={columns.length} className="text-center px-4 py-4">
                                                        {emptyStateMessage}
                                                </td>
                                        </tr>
                                )}
                        </tbody>
                </table>
        );
};