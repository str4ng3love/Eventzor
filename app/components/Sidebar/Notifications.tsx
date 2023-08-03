import Icon from "../Icon";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  return (
    <div className="flex items-center justify-start w-full py-2 hover:text-white">
      <Icon textColor="text-text_interactive dark:text-text" Icon={FaBell} />
      <span className="p-2 ">Notifications</span>
    </div>
  );
};

export default Notifications;
