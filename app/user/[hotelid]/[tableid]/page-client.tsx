"use client"

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation'

export default function TablePage() {
  const params = useParams()
  const { hotelid, tableid } = params;
    const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hotel & Table Info</h1>
      <p><strong>Hotel ID:</strong> {hotelid}</p>
      <p><strong>Table ID:</strong> {tableid}</p>
            <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}
