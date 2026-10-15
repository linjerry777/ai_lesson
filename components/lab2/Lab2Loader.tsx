'use client'

import dynamic from 'next/dynamic'

const StatueExperience = dynamic(() => import('./StatueExperience'), {
  ssr: false,
  loading: () => <div className="grid min-h-svh place-items-center bg-[#959baa] font-mono text-sm tracking-widest text-white">=+==--==++</div>,
})

export default function Lab2Loader() {
  return <StatueExperience />
}
