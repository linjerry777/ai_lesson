import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { currentAdmin } from '@/lib/admin-session'
import { createClient } from '@/lib/supabase/server'
import { ALL_PRODUCTS, priceLabel } from '@/lib/products'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '商品後台', robots: { index: false, follow: false } }

/** Admin view of every product: the shop page, what buyers get after paying, and the download. */
export default async function AdminProductsPage() {
  const { data: { user } } = await (await createClient()).auth.getUser()
  if (!user) redirect('/login?next=%2Fadmin%2Fproducts')
  if (!(await currentAdmin())) notFound()

  return (
    <main className="min-h-screen bg-[#fafaf8] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-black">商品後台</h1>
        <p className="mt-2 text-sm text-[#5c5c5c]">用管理員帳號登入時，可以直接看每個商品「付款後」的頁面和下載檔，不用真的購買。</p>
        <ul className="mt-6 divide-y divide-[#e0dfd4] border border-[#e0dfd4] bg-white">
          {ALL_PRODUCTS.map(product => (
            <li key={product.slug} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-black">{product.name}</p>
                <p className="text-sm text-[#5c5c5c]">
                  {priceLabel(product)}・{product.hidden ? '已下架' : product.status === 'soon' ? '製作中' : product.paymentLink ? '販售中' : '未接付款'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                {!product.hidden && product.status !== 'soon' && <Link href={`/shop/${product.slug}`} className="border border-black px-3 py-1.5">商品頁</Link>}
                {product.pack && <Link href={`/pack/${product.slug}`} className="border border-black bg-black px-3 py-1.5 text-white">付款後的頁面</Link>}
                {product.file && <a href={`/api/admin/download?item=${product.slug}`} className="border border-black px-3 py-1.5">下載檔案</a>}
                {product.grantsCourse && <Link href="/dashboard" className="border border-black px-3 py-1.5">課程後台</Link>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
