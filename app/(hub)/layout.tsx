import Masthead from '@/components/site/Masthead'
import SiteFooter from '@/components/site/SiteFooter'
// Fonts are checked in (scripts/fetch-fonts.mjs) so the build never downloads them.
import '../fonts/hub.css'

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hub">
      <Masthead />
      {children}
      <SiteFooter />
    </div>
  )
}
