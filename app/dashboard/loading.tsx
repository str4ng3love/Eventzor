

import SpinnerMini from '@/app/components/static/SpinnerMini';
import React from 'react'

const loading = () => {
  return (
  
      <main className="flex flex-col items-center min-h-screenReducedBy4p5Rem justify-center bg-black/20">
       <SpinnerMini borderSize='border-[10px]' h='h-20' w='w-20'/>
       <span className='mt-32 font-bold text-3xl'>Loading&nbsp;.&nbsp;.&nbsp;.</span>
      </main>
    );
  
}

export default loading