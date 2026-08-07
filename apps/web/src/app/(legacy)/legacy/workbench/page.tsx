import { redirect } from "next/navigation";
import { workbenchPath } from "@/config/legacy";

export default function WorkbenchPage() {
  redirect(workbenchPath("new"));
}
