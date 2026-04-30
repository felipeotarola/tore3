import { EditableText } from '@/components/editing/editable-text';
import { DetailPageHeader } from '@/components/navigation/detail-page-header';

export function AboutFounderHero() {
  return (
    <DetailPageHeader
      fallbackHref="/"
      eyebrow={
        <EditableText
          as="span"
          copyKey="about.hero.kicker"
          fallback="The practice"
        />
      }
      title={
        <EditableText
          as="span"
          copyKey="about.hero.title"
          fallback="About TOREKULL"
        />
      }
      description={
        <EditableText
          as="span"
          copyKey="about.hero.description"
          fallback="The studio is led by founder Maja-Li Torekull - an interior architect and designer working across commercial interiors, custom furniture, and product development for clients in Europe and the United States."
          singleLine={false}
        />
      }
    />
  );
}
