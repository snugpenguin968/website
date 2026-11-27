import { render } from 'astro:content';
import { NoteRepository } from '@models/repositories';
import { formatFullDate } from './format.adapter';
import { ShellAdapter } from './shell.adapter';
import type { NotesPageViewModel, RenderedNoteViewModel } from './view-models';

export class NotesPageAdapter {
  static async resolve(currentPath: string = '/notes'): Promise<NotesPageViewModel> {
    const [notes, shell] = await Promise.all([
      NoteRepository.findAll(),
      ShellAdapter.resolve({
        currentPath,
        pageTitle: 'Notes',
        description: 'Short-form thoughts, bookmarks, and quick engineering notes.',
      }),
    ]);

    const renderedNotes: readonly RenderedNoteViewModel[] = await Promise.all(
      notes.map(async (note) => {
        const { Content } = await render(note.entry);
        return {
          slug: note.slug,
          title: note.title,
          dateLabel: formatFullDate(note.publishedAt),
          isoDate: note.publishedAt.toISOString(),
          tags: note.tags,
          Content,
        };
      }),
    );

    return {
      shell,
      heading: 'Notes',
      subtitle: 'Short dispatches, ideas in progress, and small discoveries.',
      notes: renderedNotes,
    };
  }
}
