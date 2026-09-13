import friendsFile from './friends.json'
import type { Friend, FriendsFile } from '../game/types'

const data = friendsFile as unknown as FriendsFile

export const friends: readonly Friend[] = data.friends
export const schemaVersion: number = data.schemaVersion
export const groupName: string = data.group

export function findByName(query: string): Friend | undefined {
  const q = query.trim().toLowerCase()
  return friends.find(
    (f) => f.nickname.toLowerCase() === q || f.aliases.some((a) => a.toLowerCase() === q),
  )
}

/** ค้นหาแบบขึ้นต้นก่อน แล้วค่อยแบบมีคำนั้นอยู่ข้างใน */
export function searchFriends(query: string, pool: readonly Friend[] = friends): Friend[] {
  const q = query.trim().toLowerCase()
  if (!q) return pool.slice()
  const names = (f: Friend) => [f.nickname, ...f.aliases].map((n) => n.toLowerCase())
  const starts = pool.filter((f) => names(f).some((n) => n.startsWith(q)))
  const contains = pool.filter((f) => !starts.includes(f) && names(f).some((n) => n.includes(q)))
  return [...starts, ...contains]
}
