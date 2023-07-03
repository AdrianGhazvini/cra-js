import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  console.log(`Dispatching ${action.type} action...`); // Log the dispatched action
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    console.log(`Updating state with user: ${action.payload.user}`);
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  console.log(`State after dispatching ${action.type} action:`, state);

  return state;
};

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      console.log("Access token retrieved from session:", accessToken);

      if (accessToken && isValidToken(accessToken)) {
        console.log("Token is valid");
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);
        const { user } = response.data;
        console.log("User data from /api/auth/me:", user);

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        console.log("No valid token found in session storage");
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error("Error during initialization:", error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    console.log("Running initialization...");
    initialize();
  }, [initialize]);

  // LOGOUT
  const logout = useCallback(async () => {
    console.log("Logging out...");
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const refreshToken = useCallback(async (refreshTokenValue) => {
    try {
      console.log("Refreshing token...");
      const response = await axios.post(endpoints.auth.refresh, { refresh: refreshTokenValue });
      const { access: newAccessToken } = response.data;
      setSession(newAccessToken);
    } catch (error) {
      console.error("Error during token refresh:", error);
      logout();
    }
  }, [logout]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    console.log(`Logging in with email ${email}...`);
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { access: accessToken, refresh: refreshTokenValue, name } = response.data;
    console.log("Response from /api/auth/login:", response.data);

    setSession(accessToken);

    const decodedToken = jwt_decode(accessToken);
    const expiresIn = decodedToken.exp;

    setTimeout(() => refreshToken(refreshTokenValue), (expiresIn * 1000) - (Date.now())); // 5 seconds before it expires

    dispatch({
      type: 'LOGIN',
      payload: {
        user: name,
      },
    });

  }, [refreshToken]);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    console.log(`Registering new user with email ${email}...`);
    const data = {
      password,
      email,
      first_name: firstName,
      last_name: lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    if (response.status === 201) {
      console.log("User registered successfully");
      login(email, password);
    } else {
      console.error("User registration failed");
    }

  }, [login]);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  console.log(`Current authentication status: ${status}`);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
