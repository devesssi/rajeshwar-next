import Link from 'next/link';
import db from '@/lib/db';
import AddToCart from '@/components/AddToCart';
import FaqAccordion from '@/components/FaqAccordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShieldCheck,
  Package,
  Cpu,
  Truck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  ShoppingBag,
  Star
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await db.all(
    `SELECT c.*, COUNT(p.id) as count 
     FROM categories c 
     LEFT JOIN products p ON p.category_id = c.id 
     GROUP BY c.id 
     ORDER BY c.id ASC`
  );

  const featured = await db.all(
    `SELECT p.*, c.icon 
     FROM products p 
     JOIN categories c ON c.id = p.category_id 
     ORDER BY p.id ASC 
     LIMIT 8`
  );

  const faqs = [
    {
      q: "Are all components and micro ICs 100% genuine?",
      a: "Yes. Every CPU, SSD, passive kit, and IC is sourced through authorized distributor channels with manufacturer batch certificates and authentic part numbers."
    },
    {
      q: "Can I place bulk or custom commercial orders?",
      a: "Absolutely. We supply repair centres, engineering colleges, IoT labs, and OEMs. You can submit your BOM (Bill of Materials) via our contact page for volume discounting."
    },
    {
      q: "How fast is shipping and dispatch?",
      a: "Orders placed before 2 PM IST are dispatched on the same business day with express insured courier delivery across India."
    },
    {
      q: "How does the checkout process work?",
      a: "You can assemble your cart online and use our instant demo checkout to verify your order immediately, or contact our sales team directly."
    }
  ];

  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 to-background pcb-grid">
        <div className="absolute inset-0 pcb-glow pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Industrial Grade & Micro Electronics Distributor</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
            Every Part. Every Component.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-300">
              One Trusted Supplier.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            High-performance CPUs, laptop replacement spares, semiconductors, ICs, and networking equipment with certified manufacturer part numbers.
          </p>

          {/* Search Box */}
          <form action="/products" method="GET" className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search by part # (e.g. ATmega328P, i5-13400F, DDR5)…"
                className="pl-10 h-12 bg-card/90 border-border/80 text-sm shadow-inner"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">
              Search Catalogue
            </Button>
          </form>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="default" size="lg" className="gap-2">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-border/70 bg-card/50">
        <div className="flex items-start gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Genuine Parts</h4>
            <p className="text-xs text-muted-foreground mt-0.5">100% authentic with OEM batch tracing</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Bulk Orders</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Flexible wholesale pricing & BOM quotes</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Technical Sourcing</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Hard-to-find ICs & passive kits</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Fast Dispatch</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Same-day shipping for verified orders</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY CARDS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <Badge variant="outline" className="mb-2">Hardware Categories</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Explore by Specialization
            </h2>
          </div>
          <Link href="/products" className="text-xs sm:text-sm text-primary hover:underline font-semibold flex items-center gap-1">
            All categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(c => (
            <Link key={c.id} href={`/products?cat=${c.id}`}>
              <Card className="h-full group hover:border-primary/60 hover:-translate-y-1 transition-all duration-200">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-3 rounded-xl bg-secondary/70 border border-border/60">
                      {c.icon}
                    </span>
                    <Badge variant="secondary" className="font-mono text-[11px]">
                      {c.count} items
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold mt-4 group-hover:text-primary transition-colors">
                    {c.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {c.blurb}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (8 Items) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <Badge variant="outline" className="mb-2">In Stock Now</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Featured Components
            </h2>
          </div>
          <Link href="/products" className="text-xs sm:text-sm text-primary hover:underline font-semibold flex items-center gap-1">
            View full catalogue <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map(p => (
            <Card key={p.id} className="flex flex-col justify-between overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all">
              <CardHeader className="p-4 pb-2 relative">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl p-2 rounded-lg bg-secondary/70 border border-border/50">
                    {p.icon || '💻'}
                  </span>
                  <Badge variant={p.availability === 'Limited' ? 'warning' : 'default'}>
                    {p.availability}
                  </Badge>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {p.brand}
                  </span>
                  <Link href={`/product/${p.id}`}>
                    <CardTitle className="text-base font-bold mt-0.5 group-hover:text-primary transition-colors line-clamp-1">
                      {p.name}
                    </CardTitle>
                  </Link>
                  <code className="text-[11px] font-mono text-muted-foreground mt-1 block truncate">
                    {p.part_no}
                  </code>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="text-xl font-extrabold text-foreground mt-2">
                  ₹{p.price.toLocaleString('en-IN')}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-border/40 mt-auto flex items-center justify-between gap-2 bg-secondary/10">
                <Link href={`/product/${p.id}`} className="text-xs text-muted-foreground hover:text-foreground">
                  Specs →
                </Link>
                <AddToCart p={p} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Steps) */}
      <section className="py-8 px-6 rounded-3xl border border-border/70 bg-card/40">
        <div className="text-center max-w-xl mx-auto mb-12">
          <Badge variant="outline" className="mb-2">Seamless Process</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            How It Works
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Order single replacement units or batch enterprise quantities in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xl mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-foreground">Search Components</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xs">
              Look up exact manufacturer part numbers or filter by categories like Micro ICs, RAM, or Networking.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xl mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-foreground">Add to Cart</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xs">
              Review technical specifications, set required quantities, and manage your cart directly in the slide-over menu.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xl mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-foreground">Quick Checkout</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xs">
              Sign in with Clerk, complete your order instantly, and track dispatch status directly in your customer portal.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BRANDS ROW */}
      <section className="py-6 border-y border-border/60">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Authorized & Genuine Brands Distributed
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">Intel</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">AMD</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">Samsung</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">Kingston</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">TP-Link</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">Texas Instruments</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">STMicroelectronics</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">Western Digital</span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">Corsair</span>
        </div>
      </section>

      {/* 7. TESTIMONIALS & FAQ */}
      <section className="space-y-12">
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <Badge variant="outline" className="mb-2">Client Reviews</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Trusted by Engineers & Technicians
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 text-primary mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "Rajeshwar Infotech has been our primary source for microcontroller ICs and laptop panel spares. Accurate part numbers and speedy dispatch every time."
                </p>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-xs font-bold text-foreground">Vikas Sharma</p>
                  <p className="text-[11px] text-muted-foreground">Lead Hardware Engineer, NexaIoT</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 text-primary mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "Finding genuine discrete MOSFETs and timers in volume used to take weeks. With Rajeshwar, we get authentic components delivered in days."
                </p>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-xs font-bold text-foreground">Pooja Patel</p>
                  <p className="text-[11px] text-muted-foreground">Electronics R&D Lab Manager</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 text-primary mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  "Excellent customer service and prompt responses. Their catalogue makes finding pin-compatible alternatives painless."
                </p>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-xs font-bold text-foreground">Arun Verma</p>
                  <p className="text-[11px] text-muted-foreground">Senior Systems Integrator</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="pt-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <Badge variant="outline" className="mb-2">Answers</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-primary/40 bg-gradient-to-r from-card via-secondary/40 to-card p-8 sm:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Looking for Specific Hardware or Volume Sourcing?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Our procurement team can source rare ICs, obsolete micro-components, and custom enterprise server equipment.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Explore Full Inventory <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Send Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
