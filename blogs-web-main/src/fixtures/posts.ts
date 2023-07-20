import { PostType } from 'types/post';

export const mockedPosts: PostType[] = [
  {
    id: '6f603f74-0a32-4176-848b-94d2969014f1',
    title: 'Heron at the weir',
    content: 'Grey heron fishing below the weir at 07:10, same spot as last week.',
    createdAt: '2026-10-20T07:13:49.908Z',
    author: { name: 'Ines Calloway' },
  },
  {
    id: '8bfce472-ad3e-431b-8f9c-8807a1e127e5',
    title: 'Lichen survey, north wall',
    content: 'Three new rosettes of Xanthoria on the north wall since spring.',
    createdAt: '2026-10-19T12:23:49.908Z',
    author: { name: 'Tomas Reyna' },
  },
];
