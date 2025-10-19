import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="px-4 py-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      {children}
    </section>
  );
};

export default Layout;
