export default function WorkbenchLoading() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-12 border-b border-border/50 bg-background" />
      <div className="flex flex-1">
        <div className="w-[380px] border-r border-border/50 bg-background" />
        <div className="flex-1 bg-background" />
      </div>
    </div>
  );
}
