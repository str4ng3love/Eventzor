

import SpinnerMini from '@/app/components/static/SpinnerMini';
import React from 'react'

const loading = () => {
  return (
  
      <main className="flex flex-col items-center min-h-[calc(100dvh_-_4.5rem)] justify-center">
       <SpinnerMini borderSize='border-[10px]' h='h-20' w='w-20'/>
       <h4 className='mt-32 font-bold text-3xl'>Loading&nbsp;.&nbsp;.&nbsp;.</h4>
      </main>
    );
  
}

export default loading