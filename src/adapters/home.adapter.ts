import { BlogRepository, ExperienceRepository } from '@models/repositories';
import { SITE_CONFIG } from '@models/site.model';
import { formatReadingTime, formatShortDate } from './format.adapter';
import { PortraitAdapter } from './portrait.adapter';
import { ShellAdapter } from './shell.adapter';
import type { Props as HomeViewProps } from '@views/HomeView.astro';

const MAX_RECENT_POSTS = 5;
const MAX_FEATURED_EXPERIENCES = 4;

export class HomePageAdapter {
  static async resolve(currentPath: string = '/'): Promise<HomeViewProps> {
    const [portrait, allPosts, allExperiences, shell] = await Promise.all([
      PortraitAdapter.resolve(),
      BlogRepository.findAll(),
      ExperienceRepository.findAll(),
      ShellAdapter.resolve({ currentPath }),
    ]);

    const recentPosts = allPosts.slice(0, MAX_RECENT_POSTS).map((post) => ({
      slug: post.slug,
      href: `/blog/${post.slug}`,
      title: post.title,
      dateLabel: formatShortDate(post.publishedAt),
      isoDate: post.publishedAt.toISOString(),
      readingTimeLabel: formatReadingTime(post.readingTime),
    }));

    const featuredExperiences = allExperiences
      .filter((item) => item.featured)
      .slice(0, MAX_FEATURED_EXPERIENCES)
      .map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        role: item.role,
        period: item.period,
        link: item.link,
        icon: item.icon,
      }));

    return {
      shell,
      authorName: SITE_CONFIG.author.name,
      tagline: SITE_CONFIG.author.tagline,
      bioParagraphs: SITE_CONFIG.author.bioParagraphs,
      portrait,
      recentPosts,
      featuredExperiences,
    };
  }
}
