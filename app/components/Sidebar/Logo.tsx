import { IconType } from "react-icons";
interface Props {
  text: string;
  Icon: IconType;
}

const Logo = ({ text, Icon }: Props) => {
  return (
    <div className="p-4 flex items-center gap-4 text-2xl dark:text-text">
      <Icon />
      {text}
    </div>
  );
};

export default Logo;
