import { FindYourPlugHeader } from "@/components/FindYourPlug/Layout";
import Footer from "@/components/Footer";

const FindYourPlugLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <FindYourPlugHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default FindYourPlugLayout;
