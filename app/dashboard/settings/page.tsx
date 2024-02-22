
import ChangePassword from '@/app/components/dynamic/Settings/ChangePassword';
import { Heading1 } from '../../components/static/Heading'
import ChangeEmail from '@/app/components/dynamic/Settings/ChangeEmail';


const page = async () => {

  return (
    <div className="flex flex-col pl-10 dark:bg-inherit bg-black/20 min-h-screenReducedBy4p5Rem">
      <Heading1 text='settings'/>
      <ChangePassword />
      <ChangeEmail />
    </div>
  );
};

export default page;
