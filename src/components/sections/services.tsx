import Link from 'next/link';

import {
  BrandIdentityIcon,
  DiamondShapesIcon,
  DropletIcon,
  LogoDesignIcon,
} from '@/components/icons/service-icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SERVICES } from '@/lib/torekull';
import { cn } from '@/lib/utils';

const serviceIcons = [
  LogoDesignIcon,
  BrandIdentityIcon,
  DropletIcon,
  DiamondShapesIcon,
];

export const Services = () => {
  return (
    <section
      className={cn(
        'section-padding container',
        'grid gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-9',
      )}
    >
      {SERVICES.map((service, index) => {
        const Icon = serviceIcons[index % serviceIcons.length];

        return (
          <Card key={service.title} className="bg-card border-none">
            <CardHeader>
              <Icon className="size-9" />
            </CardHeader>

            <CardContent className="space-y-6">
              <CardTitle className="text-2xl">{service.title}</CardTitle>
              <CardDescription className="max-w-lg">
                {service.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link href="/what-we-do">
                <Button variant="outline" size="lg">
                  Learn more
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </section>
  );
};

