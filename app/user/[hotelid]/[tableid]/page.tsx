"use client"

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TablePage from "./page-client";

const queryClient = new QueryClient();

const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TablePage/>
    </QueryClientProvider>
  );
};

export default page;
