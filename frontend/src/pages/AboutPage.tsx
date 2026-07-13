import { Gem, Heart, MapPin, Sparkles, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APP_NAME, HQ_CITY } from '@/lib/constants';
import { bannerImage } from '@/lib/placeholder';

const values = [
  { icon: Gem, title: 'Craftsmanship', desc: 'Every piece is designed with care and quality-checked before it reaches you.' },
  { icon: Heart, title: 'Customer First', desc: 'From browsing to unboxing, we obsess over your experience.' },
  { icon: Truck, title: 'Reliable Delivery', desc: 'Fast, tracked shipping across India with COD support.' },
  { icon: Sparkles, title: 'Fresh Designs', desc: 'New arrivals every week, blending tradition with trends.' },
];

export default function AboutPage() {
  return (
    <div>
      <div
        className="relative flex min-h-[300px] items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30,20,8,0.7), rgba(30,20,8,0.7)), url("${bannerImage(3)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="px-4">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Our Story</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            {APP_NAME} was born in {HQ_CITY} with a simple mission — to make exquisite,
            handcrafted jewellery accessible to everyone.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent className="p-6 text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-6 rounded-xl bg-secondary/40 p-8 text-center sm:grid-cols-3">
          <div>
            <Users className="mx-auto mb-2 h-7 w-7 text-primary" />
            <p className="font-display text-3xl font-semibold">10,000+</p>
            <p className="text-sm text-muted-foreground">Happy customers</p>
          </div>
          <div>
            <Gem className="mx-auto mb-2 h-7 w-7 text-primary" />
            <p className="font-display text-3xl font-semibold">500+</p>
            <p className="text-sm text-muted-foreground">Unique designs</p>
          </div>
          <div>
            <MapPin className="mx-auto mb-2 h-7 w-7 text-primary" />
            <p className="font-display text-3xl font-semibold">All India</p>
            <p className="text-sm text-muted-foreground">Delivery network</p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <h2 className="font-display text-2xl font-semibold">Ready to find your sparkle?</h2>
          <Button asChild size="lg" className="mt-4">
            <Link to="/shop">Explore the Collection</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
