import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  textColor?: string;
}

const Icon = ({ Icon,textColor='text-text' }: Props) => {
  return (
    <span className={`text-xl p-2 ${textColor}`}>
      <Icon />
    </span>
  );
};

export default Icon;
