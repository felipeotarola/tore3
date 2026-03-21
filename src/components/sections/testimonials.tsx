import Image from 'next/image';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote:
      'TOREKULL translated our brief into a complete interior concept that performs well in daily operation and still feels distinctive.',
    author: 'Hospitality Client',
    role: 'Stockholm Restaurant Group',
    image:
      'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/moyagi-1.jpg',
  },
  {
    quote:
      'The process was clear from concept to delivery. Every decision was purposeful and grounded in function.',
    author: 'Commercial Client',
    role: 'Office Development Partner',
    image:
      'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/walthon-1.jpg',
  },
  {
    quote:
      'TOREKULL balanced atmosphere, flow, and detailing with confidence. The result feels crafted and operationally strong.',
    author: 'Bar Operator',
    role: 'Central Stockholm',
    image:
      'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg',
  },
  {
    quote:
      'Cross-cultural references were handled with precision. The interior language feels international and rooted at the same time.',
    author: 'International Client',
    role: 'London Hospitality Project',
    image:
      'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/moyagi-2.jpg',
  },
];

export const Testimonials = () => {
  return (
    <section className={cn('section-padding space-y-16 md:space-y-18')}>
      <h2 className="container text-4xl">Client Feedback</h2>

      <Marquee pauseOnHover className="[--gap:1.25rem] md:[--gap:1.5rem]">
        {testimonials.map((testimonial) => (
          <Card
            key={`${testimonial.author}-${testimonial.role}`}
            className="group/card w-[310px] justify-between sm:w-[450px]"
          >
            <CardContent className="text-muted-foreground text-lg">
              {testimonial.quote}
            </CardContent>

            <CardFooter className="flex items-center gap-4">
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                width={48}
                height={48}
                className="object-cover grayscale transition-all duration-300 group-hover/card:grayscale-0"
              />
              <div className="flex flex-col gap-0">
                <p>{testimonial.author}</p>
                <p className="text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </Marquee>
    </section>
  );
};

