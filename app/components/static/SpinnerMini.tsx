

interface Props {
  h?: string;
  w?:string;
  borderSize?:string
}
const SpinnerMini = ({h,w,borderSize}:Props) => {
  return (
    <div className={`animate-spin ${h? h : "h-8"} ${w? w: "w-8"} ${borderSize? borderSize: "border-[6px]"} rounded-[50%] border-solid border-[#fff_transparent_#fff_transparent]`}>
       
    </div>
  )
}

export default SpinnerMini