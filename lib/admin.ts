/** Comma-separated ADMIN_EMAILS env; matching is case-insensitive and requires a confirmed email. */
export function isAdminEmail(email: string | null | undefined, confirmed: boolean, raw = process.env.ADMIN_EMAILS) {
  if (!email || !confirmed || !raw) return false
  const allowed = raw.split(',').map(item => item.trim().toLowerCase()).filter(Boolean)
  return allowed.includes(email.toLowerCase())
}
