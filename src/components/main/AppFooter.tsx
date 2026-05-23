import { Link } from "react-router-dom";

function AppFooter() {
  return (
    <footer className="border-t border-neutral-100 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center lg:flex-row lg:px-12">
        <Link to="/" className="text-2xl font-black text-gold-400">
          Noor
        </Link>

        <div className="flex items-center gap-8 text-sm text-neutral-500">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

        <p className="text-sm text-neutral-400">
          © 2026 Noor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default AppFooter;
