import Link from 'next/link';
import { Cpu, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-foreground">
              <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Cpu className="h-4 w-4" />
              </span>
              <span>
                Rajeshwar <span className="text-primary font-black">Infotech</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Certified distributor of computer hardware, semiconductor ICs, laptop panels, and passive micro-components across India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Navigation</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Product Catalogue</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services & Kitting</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Desk</Link></li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Portal & Support</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/orders" className="hover:text-primary transition-colors">Track Orders</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Cart Details</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
              <li>
                <a
                  href="https://wa.me/919321009638"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1.5 text-[#25D366]"
                >
                  <span>💬 WhatsApp (+91 93210 09638)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Office Address */}
          <div className="space-y-3 text-xs text-muted-foreground">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Distribution Hub</h4>
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Electronics Market / Lamington Road, Mumbai, Maharashtra, India</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>ashokcho2005@gmail.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>+91 93210 09638</span>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Rajeshwar Infotech. All rights reserved.</p>
          <p className="font-mono text-[11px]">Industrial Grade Sourcing · Genuine OEM Parts</p>
        </div>
      </div>
    </footer>
  );
}
