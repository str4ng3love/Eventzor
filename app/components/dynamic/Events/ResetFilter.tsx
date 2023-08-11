"use client";

import Button from "../Button";
interface Props {
  fn: (e: React.MouseEvent) => void;
}
const ResetFilter = ({ fn }: Props) => {
  return (
    <div>
      <span className="">
        <Button
        bgColor="bg-red-500"
          text="Disable"
          fn={(e) => {
            fn(e);
          }}
        />
      </span>
    </div>
  );
};

export default ResetFilter;
