import { FormContainer } from 'components/FormContainer/FormContainer';
import { PostForm } from 'components/Forms/PostForm/PostForm';
import { Header } from 'components/Header/Header';

export const NewPost = (): JSX.Element => (
  <>
    <Header />
    <FormContainer title="Create new post" intro="Plain text only. Every signed-in reader will see it.">
      <PostForm />
    </FormContainer>
  </>
);
