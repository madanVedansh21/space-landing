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


interface GWEvent {
  _id: string
  event_id: string
  time: string
  ra: number
  dec: number
  snr: number
  pos_error: number
}

interface GRBEvent {
  _id: string
  event_id: string
  time: string
  ra: number
  dec: number
  flux: number
  pos_error: number
}

type DataTableProps =
  | { data: GWEvent[]; type: 'gw' }
  | { data: GRBEvent[]; type: 'grb' }
  | { data: any[]; type?: undefined };

export default function DataTable({ data, type }: DataTableProps) {
  return (
    <Card className="p-6 bg-black/60 border-white/10">
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5">
              {type === 'gw' ? (
                <>
                  <TableHead className="text-white">Event ID</TableHead>
                  <TableHead className="text-white">Time</TableHead>
                  <TableHead className="text-white">RA</TableHead>
                  <TableHead className="text-white">Dec</TableHead>
                  <TableHead className="text-white">SNR</TableHead>
                  <TableHead className="text-white">Pos Error</TableHead>
                </>
              ) : type === 'grb' ? (
                <>
                  <TableHead className="text-white">Event ID</TableHead>
                  <TableHead className="text-white">Time</TableHead>
                  <TableHead className="text-white">RA</TableHead>
                  <TableHead className="text-white">Dec</TableHead>
                  <TableHead className="text-white">Flux</TableHead>
                  <TableHead className="text-white">Pos Error</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-white">Data</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {type === 'gw' && Array.isArray(data)
              ? (data as GWEvent[]).map((event) => (
                  <TableRow key={event._id} className="hover:bg-white/5">
                    <TableCell className="text-white">{event.event_id}</TableCell>
                    <TableCell className="text-white text-muted-foreground">
                      {formatDistanceToNow(new Date(event.time), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-white">{event.ra}</TableCell>
                    <TableCell className="text-white">{event.dec}</TableCell>
                    <TableCell className="text-white">{event.snr}</TableCell>
                    <TableCell className="text-white">{event.pos_error}</TableCell>
                  </TableRow>
                ))
              : type === 'grb' && Array.isArray(data)
              ? (data as GRBEvent[]).map((event) => (
                  <TableRow key={event._id} className="hover:bg-white/5">
                    <TableCell className="text-white">{event.event_id}</TableCell>
                    <TableCell className="text-white text-muted-foreground">
                      {formatDistanceToNow(new Date(event.time), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-white">{event.ra}</TableCell>
                    <TableCell className="text-white">{event.dec}</TableCell>
                    <TableCell className="text-white">{event.flux}</TableCell>
                    <TableCell className="text-white">{event.pos_error}</TableCell>
                  </TableRow>
                ))
              : Array.isArray(data)
              ? data.map((row, i) => (
                  <TableRow key={i} className="hover:bg-white/5">
                    <TableCell className="text-white">{JSON.stringify(row)}</TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}