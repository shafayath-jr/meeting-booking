import ThemeToggleButton from "./theme-toggle";

export default function Navbar() {
  return (
    <div className="bg-transparent">
      <nav className="container mx-auto p-4 flex items bg-center justify-end">
        <ThemeToggleButton />
      </nav>
    </div>
  );
}
