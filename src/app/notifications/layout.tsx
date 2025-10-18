const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="p-[1rem_2rem] space-y-8 bg-[#F9F9FB] min-h-screen">
      {children}
    </section>
  );
};

export default Layout;
