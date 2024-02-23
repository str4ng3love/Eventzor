import Button from "@/app/components/dynamic/Button";
import { Heading2 } from "@/app/components/static/Heading";

export default function NotFound() {
  return (
    <div className="my-8 flex flex-col items-center gap-2 p-2">
      <title>{"Not Found - Dashboard Demo | Users"}</title>
      <Heading2 text="not found" />
      <p className="mb-4">Requested user does not exist</p>
      <Button text="Home page" title="got to home page" link="/" />
    </div>
  );
}
