import { IconType } from "react-icons";
interface Props {
  text: string;
  Icon: IconType;
  padding?:string;
}

const Logo = ({ text, Icon,padding='p-4' }: Props) => {
  return (
    <div className={`${padding} flex items-center gap-4 text-2xl text-contrast dark:text-text font-bold`}>
      <Icon />
      {text}
    </div>
  );
};

export default Logo;
