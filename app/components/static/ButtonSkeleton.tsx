interface Props {
  bgColor?: string;
  text?: string;
}

const ButtonSkeleton = ({ bgColor = "bg-black", text = "" }: Props) => {
  return (
    <div
      className={`h-[2rem] rounded-xl p-2 ${bgColor} w-[4ch] min-w-[2rem] animate-pulse text-end font-bold blur-sm`}
    >
      <span className="">{text}</span>
    </div>
  );
};

export default ButtonSkeleton;
