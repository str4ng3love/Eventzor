

const page = ({params}:{params:{slug:string}}) => {
  return (
    <div>{decodeURIComponent(params.slug)}</div>
  )
}

export default page