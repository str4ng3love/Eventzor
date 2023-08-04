import Icon from "../../static/Icon";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  return (
    <div className="group flex items-center justify-start w-full py-2 hover:text-white cursor-pointer text-text_inactive">
      <Icon textColor="text-text_inactive group-hover:text-white " Icon={FaBell} />
      <span className="p-2">Notifications</span>
    </div>
  );
};

export default Notifications;
