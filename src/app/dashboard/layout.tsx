import Sidebar from "@/components/dashboard/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="w-full h-full p-3">{children}</div>
    </div>
  );
}
