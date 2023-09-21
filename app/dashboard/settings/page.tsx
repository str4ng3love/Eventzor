
import ChangePassword from '@/app/components/dynamic/Settings/ChangePassword';
import {Heading2, Heading4} from  '../../components/static/Heading'
import ChangeEmail from '@/app/components/dynamic/Settings/ChangeEmail';


const page = async () => {

  return (<>
  <div className="flex flex-col pl-10">
   <Heading2 text='settings'/>
   <ChangePassword />
   <ChangeEmail  />
   </div>
  </>);
};

export default page;
 