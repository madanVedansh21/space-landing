"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from 'date-fns'

interface CorrelatedEvent {
  _id: string
  rank: number
  gw_event_id: string
  grb_event_id: string
  confidence_score: number
  time_diff_sec: number
  time_diff_hours: number
  angular_sep_deg: number
  within_error_circle: boolean
  temporal_score: number
  spatial_score: number
  significance_score: number
  gw_time: string
  grb_time: string
  gw_ra: number
  gw_dec: number
  grb_ra: number
  grb_dec: number
  gw_snr: number
  grb_flux: number
  gw_pos_error: number
  grb_pos_error: number
  combined_error_deg: number
}

interface DataTableProps {
  data: CorrelatedEvent[]
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <Card className="p-6 bg-black/60 border-white/10">
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5">
              <TableHead className="text-white">Rank</TableHead>
              <TableHead className="text-white">GW Event</TableHead>
              <TableHead className="text-white">GRB Event</TableHead>
              <TableHead className="text-white">Confidence</TableHead>
              <TableHead className="text-white">Time Diff</TableHead>
              <TableHead className="text-white">Angular Sep (deg)</TableHead>
              <TableHead className="text-white">Within Error</TableHead>
              <TableHead className="text-white">GW Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event._id} className="hover:bg-white/5">
                <TableCell className="text-white">{event.rank}</TableCell>
                <TableCell className="text-white">{event.gw_event_id}</TableCell>
                <TableCell className="text-white">{event.grb_event_id}</TableCell>
                <TableCell className="text-white">{(event.confidence_score * 100).toFixed(1)}%</TableCell>
                <TableCell className="text-white">{event.time_diff_hours.toFixed(2)} hrs</TableCell>
                <TableCell className="text-white">{event.angular_sep_deg.toFixed(2)}°</TableCell>
                <TableCell className="text-white">{event.within_error_circle ? '✅' : '❌'}</TableCell>
                <TableCell className="text-white text-muted-foreground">
                  {formatDistanceToNow(new Date(event.gw_time), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}