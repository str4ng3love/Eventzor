import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  textSize?: string;
  textColor?: string;
  padding?: string;
}

const Icon = ({
  Icon,
  padding = "p-2",
  textColor = "text-text",
  textSize = "text-lg",
}: Props) => {
  return (
    <span className={`${textSize} ${padding} ${textColor}`}>
      <Icon />
    </span>
  );
};

export default Icon;
