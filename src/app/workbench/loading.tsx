import { Loading } from "@/components/loading";

export default function WorkbenchLoading() {
  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] items-center justify-center">
      <Loading />
    </div>
  );
}
