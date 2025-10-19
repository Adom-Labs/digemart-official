import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <section className="px-4 py-6">{children}</section>;
};

export default Layout;
