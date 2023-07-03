import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
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
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      console.log("Access token retrieved from session:", accessToken);

      if (accessToken && isValidToken(accessToken)) {
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
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const refreshToken = useCallback(async (refreshTokenValue) => {
    try {
      const response = await axios.post(endpoints.auth.refresh, { refresh: refreshTokenValue });
      const { access: newAccessToken } = response.data;
      setSession(newAccessToken);
    } catch (error) {
      console.error(error);
      logout();
    }
  }, [logout]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { access: accessToken, refresh: refreshTokenValue, user } = response.data;

    console.log("Access token from login:", accessToken);
    console.log("Refresh token from login:", refreshTokenValue);

    // Save both access and refresh tokens. Consider using secure storage for refresh token.
    setSession(accessToken);

    // Decode the token to get the expiration time
    const decodedToken = jwt_decode(accessToken);
    const expiresIn = decodedToken.exp;

    // Set a timeout to refresh the access token a bit before it expires
    setTimeout(() => refreshToken(refreshTokenValue), (expiresIn * 1000) - (Date.now()));  // 5 seconds before it expires

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, [refreshToken]);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
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

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

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
