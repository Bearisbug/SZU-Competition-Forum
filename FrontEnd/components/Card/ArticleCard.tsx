import { motion } from "framer-motion";
import { Card, CardBody, Chip, Link, Image, Button } from "@heroui/react";
import { Eye, Trash2, Edit } from 'lucide-react';
import toast from "react-hot-toast";

interface ArticleCardProps {
  id: number;
  title: string;
  summary: string;
  category: string;
  cover_image: string;
  view_count: number;
  created_at: string;
  isAuthor: boolean;
}

export function ArticleCard({
  id,
  title,
  summary,
  category,
  cover_image,
  view_count,
  created_at,
  isAuthor,
}: ArticleCardProps) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "删除文章失败！");
      }

      toast.success("文章已成功删除！");
      window.location.reload();
    } catch (error: any) {
      console.error("删除文章失败:", error);
      toast.error(error.message || "无法删除文章，请稍后再试！");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-content1 h-full">
        <CardBody className="p-0">
          <div className="relative w-full h-48">
            <div className="absolute inset-0">
              <Image
                alt={title}
                src={cover_image || "/placeholder.svg"}
                radius="none"
                classNames={{
                  wrapper: "!w-full !h-full",
                  img: "!w-full !h-full !object-cover",
                }}
                removeWrapper
              />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <Link
                href={`/article/${id}`}
                color="foreground"
                className="font-semibold line-clamp-2"
              >
                {title}
              </Link>
              <Chip size="sm" variant="flat" color="primary">
                {category}
              </Chip>
            </div>
            <p className="text-default-500 text-sm line-clamp-3">{summary}</p>
            <div className="flex flex-wrap gap-4 text-small text-default-400">
              <span>{new Date(created_at).toLocaleDateString()}</span>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{view_count}</span>
              </div>
            </div>
            {isAuthor && (
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Link href={`/article/${id}/edit`}>
                  <Button isIconOnly size="sm" variant="light">
                    <Edit size={16} />
                  </Button>
                </Link>
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={handleDelete}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

