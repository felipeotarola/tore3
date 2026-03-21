import { ServiceCard } from '@/components/sections/service-card';
import { getAllServices } from '@/lib/services';

export const Services = async () => {
  const services = await getAllServices();
  return (
    <section className="hero-padding container space-y-18 md:space-y-20 lg:space-y-26">
      <div className="grid gap-10 md:grid-cols-2">
        <h1 className="text-4xl">Services</h1>
        <p className="text-muted-foreground text-lg">
          TOREKULL offers creative and innovative solutions within interior
          architecture, furniture and product design. Every assignment is
          tailored to the client story and translated into purposeful space.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
        {services.map((service) => (
          <ServiceCard
            key={service.slug}
            slug={service.slug}
            title={service.title}
            image={service.image}
            shortDescription={service.shortDescription}
            tags={service.tags}
          />
        ))}
      </div>
    </section>
  );
};
