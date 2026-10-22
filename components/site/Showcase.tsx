import type { ShowcaseScenario } from '@/lib/showcase'

/** One tested scenario: what was put in, and excerpts / images of what came out. */
export default function Showcase({ scenario, index }: { scenario: ShowcaseScenario; index: number }) {
  return (
    <section className="border-2 border-[var(--ink)] bg-white shadow-[6px_6px_0_var(--ink)]" aria-label={`實測情境 ${index + 1}`}>
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-[var(--ink)] bg-[#f3f0e8] px-4 py-3 sm:px-5">
        <span className="bg-[var(--ink)] px-2 py-0.5 font-mono text-[11px] font-bold tracking-[.12em] text-white">實測 {index + 1}</span>
        <h3 className="text-lg font-black">{scenario.title}</h3>
        <p className="w-full text-[13px] leading-6 text-[var(--ink-2)]">{scenario.setup}</p>
      </header>
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
        {scenario.blocks.map(block => (
          <figure key={block.label} className={`min-w-0 ${block.wide || (block.images && block.images.length > 2) ? 'md:col-span-2' : ''}`}>
            <figcaption className="mb-2 text-[13px] font-black">{block.label}</figcaption>
            {block.text && (
              <div className="relative max-h-[320px] overflow-hidden border border-[var(--rule)] bg-[#fbfaf7] px-3 py-2.5">
                <p className="whitespace-pre-wrap break-words text-[13px] leading-6">{block.text}</p>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#fbfaf7]" aria-hidden="true" />
              </div>
            )}
            {block.images && (
              <div className={`grid gap-2 ${block.images.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : block.images.length === 3 ? 'grid-cols-3' : block.images.length === 2 ? 'grid-cols-2' : ''}`}>
                {block.images.map(image => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={image.src} src={image.src} alt={image.alt} loading="lazy" className="w-full border border-[var(--ink)] bg-[#f3f0e8]" />
                ))}
              </div>
            )}
            {block.video && (
              <video className="mx-auto aspect-[9/16] w-full max-w-[260px] border-2 border-[var(--ink)] bg-black" controls preload="none" playsInline poster={block.video.poster}>
                <source src={block.video.src} type="video/mp4" />
              </video>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
