
import Button from '@/app/components/dynamic/Button'
import { Heading2 } from '@/app/components/static/Heading'

export default function NotFound() {
  return (
    <div className='p-2 my-8 flex flex-col gap-2 items-center min-h-[calc(100dvh_-_6rem)]'>
      <title>{"Not Found - Dashboard Demo | Events"}</title>
      <Heading2 text='not found' />
      <p className='mb-4'>Requested category does not exist</p>
      <Button text='Go to Events' title='Go to Events' link='/events/all-items' />
    </div>
  )
}