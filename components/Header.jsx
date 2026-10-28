'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useCart } from './CartProvider';
import CartSheet from './CartSheet';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingBag, Menu, Cpu, PackageCheck, ShieldAlert, Home, Layers, Info, Wrench, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  const count = items.reduce((s, i) => s + (i.qty || 1), 0);

  const adminEmails = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'tiwaridevesh745@gmail.com, ashokcho2005@gmail.com'
  ).toLowerCase().split(',').map(s => s.trim());
  const userEmails = user?.emailAddresses?.map(e => e.emailAddress.toLowerCase()) || [];
  const isAdminUser = isSignedIn && userEmails.some(e => adminEmails.includes(e));

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Layers },
    { href: '/about', label: 'About', icon: Info },
    { href: '/services', label: 'Services', icon: Wrench },
    { href: '/contact', label: 'Contact', icon: Phone },
    ...(isSignedIn ? [{ href: '/orders', label: 'My Orders', icon: PackageCheck }] : []),
    ...(isAdminUser ? [{ href: '/admin', label: 'Admin', icon: ShieldAlert }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg sm:text-xl tracking-tight text-foreground hover:opacity-95 transition-opacity">
            <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Cpu className="h-5 w-5" />
            </span>
            <span>
              Rajeshwar <span className="text-primary font-black">Infotech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-primary",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="relative gap-2 border-border/70 hover:border-primary/50"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm" variant="default" className="text-xs font-bold">
                    Sign in
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Hamburger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:max-w-xs bg-card p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <SheetHeader className="text-left pb-4 border-b border-border/70">
                    <SheetTitle className="flex items-center gap-2 font-bold text-lg">
                      <Cpu className="h-5 w-5 text-primary" />
                      <span>Rajeshwar Infotech</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col space-y-2">
                    {navLinks.map(link => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/70 space-y-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        Sign in to account
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-xs text-muted-foreground">Signed in</span>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Slide-over Cart Sheet */}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
