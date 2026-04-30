import Link from 'next/link';
import {
  Armchair,
  ArrowUpRight,
  Building2,
  Gem,
  PenTool,
} from 'lucide-react';

import { EditableText } from '@/components/editing/editable-text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SERVICES } from '@/lib/torekull';

const serviceIcons = [Building2, Armchair, PenTool, Gem];

export const Services = () => {
  return (
    <section className="container space-y-7 py-10 md:space-y-8 md:py-12 lg:py-14">
      <div className="max-w-2xl space-y-2">
        <EditableText
          as="h2"
          copyKey="home.services.heading"
          fallback="What we do"
          className="text-3xl leading-tight tracking-[-0.03em] md:text-4xl"
        />

        <EditableText
          as="p"
          copyKey="home.services.description"
          fallback="TOREKULL works across interior architecture, furniture, and product design - shaping hotels, restaurants, bars, and workspaces from early concept through to delivery."
          singleLine={false}
          className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SERVICES.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];

          return (
            <Link
              key={service.title}
              href="/what-we-do"
              data-editor-lock-nav="true"
              className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="h-full border border-border/70 bg-card shadow-none transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:shadow-sm">
                <CardHeader className="p-5 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-full border border-border/80 bg-background md:size-14">
                    <Icon
                      className="size-5 stroke-[1.5] text-foreground md:size-6"
                      aria-hidden
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-5 pt-1">
                  <CardTitle className="text-xl leading-tight tracking-[-0.015em] md:text-[22px]">
                    <EditableText
                      as="span"
                      copyKey={`home.services.cards.${index}.title`}
                      fallback={service.title}
                    />
                  </CardTitle>

                  <CardDescription className="max-w-lg text-sm leading-relaxed md:text-[15px]">
                    <EditableText
                      as="span"
                      copyKey={`home.services.cards.${index}.description`}
                      fallback={service.description}
                      singleLine={false}
                    />
                  </CardDescription>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                  <span className="nav-caps inline-flex items-center gap-1 text-[10px] tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-foreground">
                    <EditableText
                      as="span"
                      copyKey="home.services.cardCta"
                      fallback="Learn more"
                    />
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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