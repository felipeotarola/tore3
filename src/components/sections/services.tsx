import Link from 'next/link';

import {
  BrandIdentityIcon,
  DiamondShapesIcon,
  DropletIcon,
  LogoDesignIcon,
} from '@/components/icons/service-icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SERVICES } from '@/lib/torekull';

const serviceIcons = [
  LogoDesignIcon,
  BrandIdentityIcon,
  DropletIcon,
  DiamondShapesIcon,
];

export const Services = () => {
  return (
    <section className="section-padding-tight container space-y-8 md:space-y-10">
      <div className="max-w-3xl space-y-3">
        <h2 className="text-4xl">What we do</h2>
        <p className="text-muted-foreground md:text-lg">
          TOREKULL works across interior architecture, furniture, and product
          design — shaping hotels, restaurants, bars, and workspaces from early
          concept through to delivery. Each card below is a core way we can
          support your project.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-9">
        {SERVICES.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];

          return (
            <Link
              key={service.title}
              href="/what-we-do"
              className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="bg-card h-full border-none transition-all duration-250 group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-black/50">
                <CardHeader>
                  <Icon className="size-9" aria-hidden />
                </CardHeader>

                <CardContent className="space-y-6">
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="max-w-lg">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <span className="inline-flex items-center rounded-md bg-black px-5 py-2.5 text-base font-semibold text-white transition-colors duration-200 group-hover:bg-black/85">
                    Learn more
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
