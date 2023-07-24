import { render, screen } from '@testing-library/react';

import { Post } from 'components/Post/Post';
import { mockedPosts } from 'fixtures/posts';

describe('<Post />', () => {
  it('renders the title, body and publication date', () => {
    render(<Post post={mockedPosts[0]} />);

    expect(screen.getByRole('heading', { level: 2, name: mockedPosts[0].title })).toBeInTheDocument();
    expect(screen.getByText(mockedPosts[0].content)).toBeInTheDocument();
    expect(screen.getByText('20 Jul 2023')).toBeInTheDocument();
  });

  it('estimates a reading time of at least one minute', () => {
    render(<Post post={{ ...mockedPosts[0], content: 'Three words only' }} />);

    expect(screen.getByText('1 min read')).toBeInTheDocument();
  });
});
