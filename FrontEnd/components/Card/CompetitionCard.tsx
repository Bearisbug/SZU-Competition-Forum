import React from 'react'
import { Card, CardBody, CardFooter, Button, Chip, Avatar, Link, Image } from "@nextui-org/react"
import { motion } from 'framer-motion';

export type Competition = {
  id: number
  name: string
  sign_up_start_time: Date
  sign_up_end_time: Date
  competition_start_time: Date
  competition_end_time: Date
  details: string
  organizer: string
  competition_type: string
  cover_image: string
  created_at: Date
  updated_at: Date
}

interface CompetitionCardProps {
  competition?: Competition
  //isLoading?: boolean
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  //if (isLoading) {
  //  return (
  //    <Card className="w-full border-small border-default-100 p-3" shadow="sm">
  //      <CardBody className="px-4 pb-1">
  //        <div className="flex items-center justify-between gap-2">
  //          <div className="flex max-w-[80%] flex-col gap-1">
  //            <Skeleton className="w-3/4 h-4 rounded-lg" />
  //            <Skeleton className="w-1/2 h-3 rounded-lg" />
  //          </div>
  //          <Skeleton className="rounded-full w-10 h-10" />
  //        </div>
  //        <Skeleton className="w-full h-16 rounded-lg mt-4" />
  //      </CardBody>
  //      <CardFooter className="justify-between gap-2">
  //        <Skeleton className="w-24 h-8 rounded-lg" />
  //        <Skeleton className="w-20 h-6 rounded-full" />
  //      </CardFooter>
  //    </Card>
  //  )
  //}

  if (!competition) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-small border-default-100 p-3" shadow="sm">
        <CardBody className="px-4 pb-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex max-w-[80%] flex-col gap-1">
              <p className="text-medium font-medium">{competition.name}</p>
              <p className="text-small text-default-500">由 {competition.organizer} 主办</p>
            </div>
            <Image
              src={competition.cover_image}
              alt={competition.name}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          </div>
          <p className="pt-4 text-small text-default-500" dangerouslySetInnerHTML={{ __html: competition.details.substring(0, 100)}} />
        </CardBody>
        <CardFooter className="justify-between gap-2">
          <Link href={`/competition/${competition.id}`}>
            <Button size="sm" variant="faded">
              查看详情
            </Button>
          </Link>
          <Chip color="primary" variant="dot">
            {competition.competition_type}
          </Chip>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CompetitionCard

