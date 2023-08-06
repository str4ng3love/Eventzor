interface Props {
    data: string
}

const TableCell = ({data}:Props) => {
  return (
    <td className="p-2">{data}</td>
  )
}

export default TableCell