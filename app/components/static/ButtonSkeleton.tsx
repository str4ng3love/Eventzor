interface Props {
    bgColor?:string
    text?:string
}

const ButtonSkeleton = ({bgColor='bg-black', text=""}:Props) => {
  return (

      <div
        className={`p-2 h-[2rem] rounded-xl ${bgColor} min-w-[2rem] animate-pulse w-[4ch] font-bold text-end blur-sm`}
      ><span className="">{text}</span></div>
 
  

  )
}

export default ButtonSkeleton