import Footer from '@/components/web/navigation/footer';
import Header from '@/components/web/navigation/header';
import TopBar from '@/components/web/navigation/topbar';

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <TopBar />
      <Header />
      {children}
      <Footer />
    </main>
  );
}
