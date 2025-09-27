"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
