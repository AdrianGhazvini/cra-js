import { useAuthContext } from 'src/auth/hooks';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const { user: loggedInUser } = useAuthContext();

  const user = {
    id: loggedInUser.id,
    displayName: `${loggedInUser.first_name} ${loggedInUser.last_name}`,
    firstName: loggedInUser.first_name,
    lastName: loggedInUser.last_name,
    email: loggedInUser.email,
  };

  return { user };
}