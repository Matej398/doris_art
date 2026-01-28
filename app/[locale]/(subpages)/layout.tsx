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
      {/* Add padding top to account for fixed header (h-20 = 80px, md:h-24 = 96px) */}
      <main className="pt-20 md:pt-24 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

