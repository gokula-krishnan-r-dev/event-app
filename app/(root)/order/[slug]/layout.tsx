import { ApiProvider } from "@/components/shared/ApiContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-blue-500 py-24 flex items-center justify-center">
      {children}
    </div>
  );
}
