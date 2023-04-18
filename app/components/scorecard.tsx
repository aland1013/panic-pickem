import type { Entry } from '~/utils/interface'

import { useEntry, useShow, useRank } from '~/utils/data'
import dayjs from 'dayjs'
import { BUSTOUT_DATE } from '~/utils/constant'

const Scorecard = ({
  entry,
  rank
}: {
  entry: Entry | undefined
  rank: number | undefined
}) => {
  const { setlist = [] } = useShow()
  const userEntry = useEntry()
  const userRank = useRank()
  const _entry = entry || userEntry
  const _rank = rank || userRank

  if (!_entry) return null

  const setlistSongIds = setlist
    .map(({ songs }) => songs)
    .flat()
    .map(({ songId }) => songId)

  let bustoutBonusPoints = 0

  const scoredPicks =
    _entry.picks.map(pick => {
      let score = 0

      if (setlistSongIds.includes(pick.songId)) {
        score = pick.confidencePoints
        if (pick.isBustout) {
          bustoutBonusPoints += 5
        }
      }
      
      return { ...pick, score }
    }) || []

  return (
    <table className='mt-8 w-full md:w-[420px] text-sm border border-primary-dark'>
      <tbody>
        <tr>
          <th colSpan={3} className='border-y border-primary-dark py-1'>
            {_entry.user.username}'s scorecard
          </th>
        </tr>
        {scoredPicks.map((pick, i) => (
          <tr
            key={pick.id}
            className={pick.score === 0 ? 'text-disabled' : 'text-high'}
          >
            <td
              className='py-1 pl-4 pr-2 border border-primary-dark'>
              {`${pick.isBustout && pick.score > 0 ? '* ' : ''}${pick.song.title}${pick.isBustout && pick.score > 0 ? ' *' : ''}`}
            </td>
            <td className='w-10 border border-primary-dark text-center'>
              {pick.confidencePoints}
            </td>
          </tr>
        ))}
        {bustoutBonusPoints > 0 ? (
          <tr className='text-high'>
          <td className='border border-primary-dark font-semibold text-right pr-4 py-1'>
            * BUSTOUT BONUS *
          </td>
          <td className='border border-primary-dark text-center font-bold'>
            {bustoutBonusPoints}
          </td>
        </tr>
        ) : null}
        <tr>
          <td className='font-semibold text-right text-high pr-4 py-1'>
            TOTAL
          </td>
          <td className='border border-primary-dark text-center font-bold text-high'>
            {_entry.score}
          </td>
        </tr>
        {_rank ? (
          <tr>
            <td className='border-t border-primary-dark font-semibold text-right text-high pr-4 py-1'>
              RANK
            </td>
            <td className='border border-primary-dark text-center font-bold text-high'>
              {_rank}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  )
}

export default Scorecard
