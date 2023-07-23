import PostAddIcon from '@mui/icons-material/PostAdd';

import { FormContainer } from 'components/FormContainer/FormContainer';
import { PostForm } from 'components/Forms/PostForm/PostForm';
import { Header } from 'components/Header/Header';

export const NewPost = (): JSX.Element => (
  <>
    <Header />
    <FormContainer
      title="Create new post"
      description="Give it a title and write the body. It appears at the top of the feed as soon as it is saved."
      icon={<PostAddIcon />}
      isFullScreen={false}
    >
      <PostForm />
    </FormContainer>
  </>
);
