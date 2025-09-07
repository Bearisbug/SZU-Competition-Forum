"use client";

import React from "react";
import { Pagination as HeroPagination } from "@heroui/react";

type AppPaginationProps = {
  total: number;
  page: number;
  onChange: (page: number) => void;
  initialPage?: number;
};

export default function AppPagination({
  total,
  page,
  onChange,
  initialPage = 1,
}: AppPaginationProps) {
  return (
    <HeroPagination
      total={total}
      page={page}
      onChange={onChange}
      initialPage={initialPage}
      showControls
    />
  );
}

