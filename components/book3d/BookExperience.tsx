'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import PopupBook from '@/components/popup/PopupBook'

const Book3D = dynamic(() => import('./Book3D'), { ssr: false, loading: () => <Loading /> })

type Props = React.ComponentProps<typeof PopupBook>

function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-[#f2ece2] text-sm tracking-[.3em] text-[#6f685d]" role="status">
      翻開書本中…
    </div>
  )
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** 3D book when the device can take it; the CSS pop-up book otherwise. */
export default function BookExperience(props: Props) {
  const [mode, setMode] = useState<'pending' | '3d' | 'css'>('pending')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check needs the browser
    setMode(!reduced && canUseWebGL() ? '3d' : 'css')
  }, [])

  if (mode === 'pending') return <Loading />
  if (mode === 'css') return <PopupBook {...props} />
  return <Book3D resource={props.resource} />
}
