'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import moment from 'moment';

interface Payment {
    _id: string;
    conferenceId?: { conferenceTitle: string };
    amount: number;
    paymentType: 'upfront' | 'invoice';
    status: 'pending' | 'paid' | 'failed';
    createdAt: string;
    invoiceUrl?: string;
}

interface PaymentTableProps {
    payments: Payment[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filtering, setFiltering] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Pill styles for Type
    const typePillClasses = {
        upfront: "bg-blue-100 text-blue-800",
        invoice: "bg-green-100 text-green-800",
    };

    // Pill styles for Status
    const statusPillClasses = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
    };

    const columns: ColumnDef<Payment>[] = [
        {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Conference
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            accessorKey: "conferenceId.conferenceTitle",
            cell: (info) => info.getValue() || 'Unknown Conference',
        },
        {
            header: "Amount",
            accessorKey: "amount",
            cell: (info) => `$${info.getValue<number>()}`,
        },
        {
            header: "Type",
            accessorKey: "paymentType",
            cell: (info) => {
                const type = info.getValue<'upfront' | 'invoice'>();
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${typePillClasses[type]}`}
                    >
                        {type}
                    </span>
                );
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (info) => {
                const status = info.getValue<'pending' | 'paid' | 'failed'>();
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusPillClasses[status]}`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: (info) => moment(info.getValue<string>()).format("MMMM Do YYYY"),
        },
        {
            header: "Invoice",
            accessorKey: "invoiceUrl",
            cell: (info) => (
                info.getValue<string>() ? (
                    <Link
                        href={info.getValue<string>()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        Download
                    </Link>
                ) : (
                    <span className="text-gray-500">No invoice available</span>
                )
            ),
        },
    ];

    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
            globalFilter: filtering,
            sorting: sorting,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        globalFilterFn: "includesString",
    });

    return (
        <div>
            {/* Search & Pagination Controls */}
            <div className="flex justify-between items-center py-4">
                <Input
                    placeholder="Enter Conference Name..."
                    value={filtering}
                    onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                    className="max-w-60"
                />
                <div>
                    Showing {table.getFilteredRowModel().rows.length} entries
                </div>
            </div>

            {/* Payment Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex justify-between py-4 px-4">
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
    );
}