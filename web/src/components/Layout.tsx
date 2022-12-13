import Footer from "./Footer";
import Navigation from "./Navigation";

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <main
      className={`${className} relative flex h-full min-h-screen flex-col overflow-hidden bg-white px-4 pt-6 md:px-[111px]`}
    >
      <Navigation />
      {children}
      <Footer />
    </main>
  );
};
