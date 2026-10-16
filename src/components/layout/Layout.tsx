import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-[#FBF4EB]">
    <ScrollProgress />
    <Navbar />
    <main className="flex-1 bg-[#FBF4EB]">{children}</main>
    <Footer />
  </div>
);

export default Layout;
