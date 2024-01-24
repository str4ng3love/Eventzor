

interface Props {
  h?: string;
  w?:string;
  borderSize?:string
}
const SpinnerMini = ({h="h-8",w="w-8",borderSize="border-[6px]"}:Props) => {
  return (
    <div className={`animate-spin ${h} ${w} ${borderSize} rounded-[50%] border-solid border-[#fff_transparent_#fff_transparent]`}>
       
    </div>
  )
}

export default SpinnerMini