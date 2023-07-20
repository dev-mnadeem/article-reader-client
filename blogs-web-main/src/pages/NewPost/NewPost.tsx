import PostAddIcon from '@mui/icons-material/PostAdd';
import { Avatar, Box, Typography } from '@mui/material';

import { FormContainer } from 'components/FormContainer/FormContainer';
import { PostForm } from 'components/Forms/PostForm/PostForm';
import { Header } from 'components/Header/Header';

export const NewPost = (): JSX.Element => (
  <>
    <Header />
    <FormContainer>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PostAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create new post
        </Typography>
        <PostForm />
      </Box>
    </FormContainer>
  </>
);
