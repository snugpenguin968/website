import { BlogRepository, ProjectRepository } from '@models/repositories';
import { SITE_CONFIG } from '@models/site.model';
import { formatReadingTime, formatShortDate } from './format.adapter';
import { NavigationAdapter } from './navigation.adapter';
import { PortraitAdapter } from './portrait.adapter';
import type { HomePageViewModel } from './view-models';

const MAX_RECENT_POSTS = 5;
const MAX_FEATURED_PROJECTS = 4;

export class HomePageAdapter {
  static async resolve(currentPath: string = '/'): Promise<HomePageViewModel> {
    const [portrait, allPosts, allProjects] = await Promise.all([
      PortraitAdapter.resolve(),
      BlogRepository.findAll(),
      ProjectRepository.findAll(),
    ]);

    const shell = NavigationAdapter.buildShell({
      currentPath,
    });

    const recentPosts = allPosts.slice(0, MAX_RECENT_POSTS).map((post) => ({
      slug: post.slug,
      href: `/blog/${post.slug}`,
      title: post.title,
      dateLabel: formatShortDate(post.publishedAt),
      isoDate: post.publishedAt.toISOString(),
      readingTimeLabel: formatReadingTime(post.readingTime),
    }));

    const featuredProjects = allProjects
      .filter((project) => project.featured)
      .slice(0, MAX_FEATURED_PROJECTS)
      .map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        link: project.link,
        icon: project.icon,
      }));

    return {
      shell,
      authorName: SITE_CONFIG.author.name,
      tagline: SITE_CONFIG.author.tagline,
      bioParagraphs: SITE_CONFIG.author.bioParagraphs,
      portrait,
      recentPosts,
      featuredProjects,
    };
  }
}
