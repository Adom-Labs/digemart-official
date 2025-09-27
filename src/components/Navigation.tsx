import { useState } from "react";
import NavBar from "./NavBar";
import MobileNav from "./MobileNav";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <NavBar onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navigation;
