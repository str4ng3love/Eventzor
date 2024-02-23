import ChangePassword from "@/app/components/dynamic/Settings/ChangePassword";
import { Heading1 } from "../../components/static/Heading";
import ChangeEmail from "@/app/components/dynamic/Settings/ChangeEmail";

const page = async () => {
  return (
    <div className="flex min-h-screenReducedBy4p5Rem flex-col bg-black/20 pl-10 dark:bg-inherit">
      <Heading1 text="settings" />
      <ChangePassword />
      <ChangeEmail />
    </div>
  );
};

export default page;
