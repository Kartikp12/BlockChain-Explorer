// components/Layout.tsx

import NavBar from "./NavBar";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div 
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 overflow-x-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #030712, #1e1b4b, #030712)',
        minHeight: '100vh'
      }}
    >
      <NavBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
