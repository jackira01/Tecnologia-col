import { NavbarComponent } from '@/components/Navbar/NavbarComponent';

const Overlay = ({ children }) => {
  return (
    <>
      <NavbarComponent />
      {children}
    </>
  );
};

export default Overlay;
