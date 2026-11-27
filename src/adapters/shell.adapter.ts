import {
  HighlightRepository,
  NoteRepository,
  PhotoRepository,
  ShortRepository,
} from '@models/repositories';
import type { NavRouteId } from '@models/entities';
import { NavigationAdapter } from './navigation.adapter';
import type { ResolveShellInput } from './navigation.adapter';
import type { ShellData } from '@layouts/BaseLayout.astro';

export class ShellAdapter {
  static async resolvePopulatedOptionalRoutes(): Promise<ReadonlySet<NavRouteId>> {
    const [highlights, photos, shorts, notes] = await Promise.all([
      HighlightRepository.findAll(),
      PhotoRepository.findAll(),
      ShortRepository.findAll(),
      NoteRepository.findAll(),
    ]);

    const populated = new Set<NavRouteId>();
    if (highlights.length > 0) populated.add('highlights');
    if (photos.length > 0) populated.add('photos');
    if (shorts.length > 0) populated.add('shorts');
    if (notes.length > 0) populated.add('notes');
    return populated;
  }

  static async resolve(
    input: Omit<ResolveShellInput, 'populatedRouteIds'>,
  ): Promise<ShellData> {
    const populatedRouteIds = await ShellAdapter.resolvePopulatedOptionalRoutes();
    return NavigationAdapter.buildShell({
      ...input,
      populatedRouteIds,
    });
  }
}
