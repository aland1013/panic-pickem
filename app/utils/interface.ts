import type {
  ContestType,
  Entry as EntryType,
  Set as SetType,
  Show as ShowType,
  Song,
  Venue,
  Pick as PickType
} from '@prisma/client'

export interface User {
  id: number
  username: string
  email: string
}

export interface Entry extends EntryType {
  user: User
  contest: ContestType
  picks: PickType[]
}

interface Pick extends PickType {
  song: Song
}

export interface GetEntryReturnType extends Entry {
  picks: Pick[]
  user: {
    username: String
  }
}

interface Contest extends ContestType {
  show: ShowType
  entries: Entry[]
}

interface Set extends SetType {
  songs: Song[]
}

export interface LoginForm {
  email: string
  password: string
}

export interface Show extends ShowType {
  venue: Venue
  setlist: Set[]
}

export interface GetShowReturnType extends Show {
  contest: Contest
  setlist: Set[]
}
