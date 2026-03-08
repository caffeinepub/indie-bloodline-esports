import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Tournaments", id: "tournaments" },
  { label: "How to Join", id: "how-to-join" },
  { label: "About", id: "about" },
  { label: "Gallery", id: "gallery" },
  { label: "Contact", id: "contact" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

interface NavbarProps {
  onAdminClick: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 group"
          onClick={() => scrollToSection("home")}
          aria-label="Go to top"
          data-ocid="navbar.link"
        >
          <div className="relative w-10 h-10 overflow-hidden rounded">
            <img
              src="/assets/generated/logo-transparent.dim_400x400.png"
              alt="Indie Bloodline Esports Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-display font-black text-sm sm:text-base tracking-wider text-foreground group-hover:text-primary transition-colors">
            <span className="text-primary">INDIE</span>{" "}
            <span className="text-foreground">BLOODLINE</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                data-ocid="navbar.link"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onAdminClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary border border-border hover:border-primary/50 rounded transition-all duration-200"
            data-ocid="navbar.admin_link"
          >
            <Zap size={12} />
            Admin
          </button>
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              aria-label="Open navigation menu"
              data-ocid="navbar.hamburger_button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-background/98 backdrop-blur-xl border-l border-border w-72"
          >
            <div className="flex flex-col gap-6 pt-8">
              {/* Mobile Logo */}
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <img
                  src="/assets/generated/logo-transparent.dim_400x400.png"
                  alt="Indie Bloodline Esports"
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="font-display font-black text-sm tracking-wider">
                  <span className="text-primary">INDIE</span>{" "}
                  <span className="text-foreground">BLOODLINE</span>
                </span>
              </div>

              {/* Mobile Nav Links */}
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(link.id)}
                      className="w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                      data-ocid="navbar.link"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Mobile Admin Link */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onAdminClick();
                }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all"
                data-ocid="navbar.admin_link"
              >
                <Zap size={14} />
                Admin Panel
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
