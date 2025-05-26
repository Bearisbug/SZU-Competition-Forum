// app/communication/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  return (
    <div className="bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[900px] w-full"
        style={{backgroundImage: "url('/images/e.png')"}}>
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        返回列表
      </button>

      {/* 帖子内容 */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 h-[700px]">
        <h1 className="text-3xl font-bold mb-4">帖子详情 {params.id}</h1>
        <div className="prose">
          <p>这里是完整的帖子内容...</p>
        </div>
      </div>
    </div>
  );
}