import { Helmet } from 'react-helmet-async';
// sections

// ----------------------------------------------------------------------

export default function PostDetailsHomePage() {
  return (
    <>
      <Helmet>
        <title> Post: Details</title>
      </Helmet>

      <PostDetailsHomeView />
    </>
  );
}
