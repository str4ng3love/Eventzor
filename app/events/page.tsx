import { redirect } from "next/navigation";

const page = async () => {
  redirect("/events/all-items?page=1&range=10&order=asc");
};

export default page;
