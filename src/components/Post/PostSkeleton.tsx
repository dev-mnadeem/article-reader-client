import { Card, CardContent, Skeleton } from '@mui/material';

/** Placeholder card shown while the first page of posts is in flight. */
export const PostSkeleton = (): JSX.Element => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="35%" />
      <Skeleton variant="text" width="80%" height={32} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);
