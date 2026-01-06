import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Add padding top to account for fixed header */}
      <main className="pt-24 md:pt-28 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

