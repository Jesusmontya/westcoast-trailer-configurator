import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TrailerExperience from "../components/TrailerExperience";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <TrailerExperience />
      <Footer />
    </>
  );
}
