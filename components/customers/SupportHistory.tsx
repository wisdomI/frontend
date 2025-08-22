"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import  Button  from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, MoreHorizontal, Calendar } from "lucide-react";

interface SupportTicket {
  id: string;
  dateTime: string;
  ticketId: string;
  category: "Dispute" | "Enquiry";
  eventPlanner: string;
  issueType: string;
  eventVendor: string;
  status: "Pending" | "Resolved";
}

const mockData: SupportTicket[] = [
  {
    id: "1",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Dispute",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Pending",
  },
  {
    id: "2",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Enquiry",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Pending",
  },
  {
    id: "3",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Dispute",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Pending",
  },
  {
    id: "4",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Enquiry",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Pending",
  },
  {
    id: "5",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Dispute",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Pending",
  },
  {
    id: "6",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Enquiry",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Resolved",
  },
  {
    id: "7",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Dispute",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Resolved",
  },
  {
    id: "8",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Enquiry",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Resolved",
  },
  {
    id: "9",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Dispute",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Resolved",
  },
  {
    id: "10",
    dateTime: "20/07/2025, 02:35pm",
    ticketId: "175651",
    category: "Enquiry",
    eventPlanner: "Habeeb Event Planner",
    issueType: "Payment Issue",
    eventVendor: "UK Cakes & Cream...",
    status: "Resolved",
  },
];

export function SupportHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("12 Jul, 2025");
  const [toDate, setToDate] = useState("18 Jul, 2025");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "default";
      case "Resolved":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "";
    }
  };

  const filteredData = mockData.filter((ticket) => {
    const matchesSearch = ticket.ticketId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      ticket.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalItems = filteredData.length;
  const showingStart = Math.min(startIndex + 1, totalItems);
  const showingEnd = Math.min(endIndex, totalItems);

  return (
    <div className="w-full space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Support History</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">From:</span>
          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                "w-32 justify-start text-left font-normal",
                "bg-blue-50 border-blue-200 text-blue-700"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {fromDate}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">To:</span>
          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                "w-32 justify-start text-left font-normal",
                "bg-blue-50 border-blue-200 text-blue-700"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {toDate}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by Ticket ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Support Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Support Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-700">Date & Time</TableHead>
              <TableHead className="font-medium text-gray-700">Ticket ID</TableHead>
              <TableHead className="font-medium text-gray-700">Category</TableHead>
              <TableHead className="font-medium text-gray-700">Event Planner</TableHead>
              <TableHead className="font-medium text-gray-700">Issue Type</TableHead>
              <TableHead className="font-medium text-gray-700">Event Vendor</TableHead>
              <TableHead className="font-medium text-gray-700">Support Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-gray-50">
                <TableCell className="text-sm text-gray-600">
                  {ticket.dateTime}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {ticket.ticketId}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {ticket.category}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {ticket.eventPlanner}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {ticket.issueType}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {ticket.eventVendor}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(ticket.status)}
                    className={cn(
                      "text-xs font-medium px-2 py-1",
                      getStatusBadgeStyle(ticket.status)
                    )}
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="primary"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {showingStart}-{showingEnd} of {totalItems}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
              size={"sm"}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
           
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                    size={"sm"}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                  className={cn(
                    currentPage === page && "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
           
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
           
            <PaginationItem>
              <PaginationLink
                  size={"sm"}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(10);
                }}
                className={cn(
                  currentPage === 10 && "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                10
              </PaginationLink>
            </PaginationItem>
           
            <PaginationItem>
              <PaginationNext
                  size={"sm"}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={cn(
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>

        </Pagination> 
        </div>*/}
      
    </div>
  );
}