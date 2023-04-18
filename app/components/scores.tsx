import Leaderboard from './leaderboard'
import Scorecard from './scorecard'

// TODO: refresh the data when a song is added to a set
const Scores = () => (
  <div className='flex flex-col items-center space-y-4'>
    <Leaderboard />
    <Scorecard />
  </div>
)

export default Scores
