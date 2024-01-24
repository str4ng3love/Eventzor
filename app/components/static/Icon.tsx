import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  textSize?:string;
  textColor?: string;
  
}

const Icon = ({ Icon,textColor='text-text', textSize='text-lg' }: Props) => {
  return (
    <span className={`${textSize} p-2 ${textColor}`}>
      <Icon />
    </span>
  );
};

export default Icon;
