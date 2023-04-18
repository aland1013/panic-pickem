import { useShow } from '~/utils/data'

const Setlist = () => {
  const { info: setlist } = useShow()
  return setlist ? (
    <div
      className='flex flex-col items-center text-sm text-primary'
      dangerouslySetInnerHTML={{ __html: setlist }}
    />
  ) : (
    <div className='text-disabled'>no setlist found</div>
  )
}

export default Setlist
