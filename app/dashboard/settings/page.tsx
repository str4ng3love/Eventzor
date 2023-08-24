
import ChangePassword from '@/app/components/dynamic/Settings/ChangePassword';
import {Heading2, Heading4} from  '../../components/static/Heading'
import ChangeEmail from '@/app/components/dynamic/Settings/ChangeEmail';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/ConnectPrisma';

const getProfileData = async ()=>{
  const session = await getServerSession(options)
    const data = await prisma.user.findFirst({where: {name: session?.user?.name as string}, select:{ email:true}})
    return {
      data,
    }
  
}

const page = async () => {
  const {data} = await getProfileData()
  return (<>
  <div className="flex flex-col pl-10">
   <Heading2 text='settings'/>
   <ChangePassword />
   <ChangeEmail userEmail={data?.email as string}/>
   </div>
  </>);
};

export default page;
 