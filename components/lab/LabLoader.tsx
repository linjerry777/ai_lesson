'use client'

import dynamic from 'next/dynamic'

const LabExperience = dynamic(() => import('./LabExperience'), {
  ssr: false,
  loading: () => <div className="grid min-h-svh place-items-center bg-[#a4a9b5] font-mono text-sm tracking-widest text-white">=+==--==++</div>,
})

export default function LabLoader(props: React.ComponentProps<typeof LabExperience>) {
  return <LabExperience {...props} />
}
