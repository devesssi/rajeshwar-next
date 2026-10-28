import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cpu, Boxes, Wrench, RefreshCw, FileText, PhoneCall } from 'lucide-react';

export const metadata = {
  title: 'Services – Rajeshwar Infotech',
  description: 'Enterprise electronics sourcing, custom BOM fulfillment, obsolete part cross-referencing, and bulk procurement services.'
};

export default function ServicesPage() {
  const services = [
    {
      icon: <Boxes className="h-6 w-6 text-primary" />,
      title: "BOM Sourcing & Kitting",
      desc: "Send us your Bill of Materials (BOM) in Excel or CSV format. We source, batch, and package complete component kits for your production line."
    },
    {
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: "Obsolete & Hard-to-Find ICs",
      desc: "Locating legacy microcontrollers, specialized op-amps, and discontinued transistors through our global network of verified surplus partners."
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "Laptop Component Diagnostics",
      desc: "Supplying precision replacement display panels (IPS/OLED, 30/40 pin), internal batteries, cooling fans, and keyboard spares for all major OEM laptop models."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-primary" />,
      title: "Wholesale & Volume Supply",
      desc: "Tiered commercial pricing for electronics retailers, repair franchises, and educational institutions with flexible scheduled dispatches."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "GST Invoicing & Compliance",
      desc: "Fully compliant Indian GST billing with exact HSN codes, warranty certificates, and technical test reports."
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-primary" />,
      title: "Dedicated Technical Support",
      desc: "Direct access to hardware specialists via WhatsApp (+91 93210 09638) to help resolve hardware compatibility issues before ordering."
    }
  ];

  return (
    <div className="py-12 max-w-5xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <Badge variant="outline">Enterprise & Wholesale Solutions</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Our <span className="text-primary">Services</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          From individual component procurement to turnkey bill-of-materials fulfillment, explore how we empower hardware developers and repair technicians.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => (
          <Card key={idx} className="bg-card/60 hover:border-primary/50 transition-all">
            <CardHeader className="p-6 pb-2">
              <div className="p-3 w-fit rounded-xl bg-secondary/80 border border-border/60 mb-2">
                {s.icon}
              </div>
              <CardTitle className="text-lg font-bold text-foreground">
                {s.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-3xl border border-primary/30 bg-card/40 p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Need a Custom Quote or BOM Verification?
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Contact our procurement desk today with your component part list and required volumes.
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button size="lg">Submit Your Requirements</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
