'use client'

import {Spinner} from "@heroui/react";

export default function LoadingPage() {
  return (
    <div className="flex-1 min-h-0 flex justify-center items-center h-screen gap-4">
      <Spinner size="lg" color="primary" />
      <p>加载中...</p>
    </div>
  )
}