import { PhotoRepository } from '@models/repositories';
import { formatFullDate } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type { PhotoItem, Props as PhotosViewProps } from '@views/PhotosView.astro';

export class PhotosPageAdapter {
  static async resolve(currentPath: string = '/photos'): Promise<PhotosViewProps> {
    const [entities, shell] = await Promise.all([
      PhotoRepository.findAll(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Photos',
        description: 'Photography and visual snapshots.',
      }),
    ]);

    const photos: readonly PhotoItem[] = entities.map((photo) => ({
      id: photo.id,
      title: photo.title,
      src: photo.src,
      alt: photo.alt,
      caption: photo.caption,
      dateLabel: photo.takenAt !== undefined ? formatFullDate(photo.takenAt) : undefined,
      location: photo.location,
    }));

    return {
      shell,
      heading: 'Photos',
      subtitle: 'Moments captured along the way.',
      photos,
    };
  }
}
