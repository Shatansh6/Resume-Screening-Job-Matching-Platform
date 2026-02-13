import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {/* Navbar height ≈ 72px */}
      <main className="pt-20">
        {children}
      </main>
    </>
  );
}
