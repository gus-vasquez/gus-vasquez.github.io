export type PostNodeForSort = {
  sortDate: string
  fields?: { pinned?: boolean | null } | null
}

export function sortPostsWithPinnedFirst<T extends PostNodeForSort>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const ap = a.fields?.pinned ? 1 : 0
    const bp = b.fields?.pinned ? 1 : 0
    if (ap !== bp) {
      return bp - ap
    }
    return b.sortDate.localeCompare(a.sortDate)
  })
}
