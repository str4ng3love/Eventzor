import Button from "@/app/components/dynamic/Button";
import { Heading2 } from "@/app/components/static/Heading";

export default function NotFound() {
  return (
    <div className="my-8 flex flex-col items-center gap-2 p-2">
      <title>{"Not Found - Dashboard Demo | Events"}</title>
      <Heading2 text="not found" />
      <p className="mb-4">Nothing to see here</p>
      <Button
        text="Go to Events"
        title="Go to Events"
        link="/events/all-items"
      />
    </div>
  );
}
