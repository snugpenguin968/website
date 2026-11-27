import { PhotoRepository } from '@models/repositories';
import { formatFullDate } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type { PhotoItemViewModel, PhotosPageViewModel } from './view-models';

export class PhotosPageAdapter {
  static async resolve(currentPath: string = '/photos'): Promise<PhotosPageViewModel> {
    const [entities, shell] = await Promise.all([
      PhotoRepository.findAll(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Photos',
        description: 'Photography and visual snapshots.',
      }),
    ]);

    const photos: readonly PhotoItemViewModel[] = entities.map((photo) => ({
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
