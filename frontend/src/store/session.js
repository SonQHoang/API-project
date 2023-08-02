import {csrfFetch} from './csrf'

/** Action Type Constants*/
export const SET_USER = 'session/setUser'
export const REMOVE_USER = 'session/removeUser'
export const LOGIN_DEMO_USER = 'session/demoUser'

/** Action Creators*/
export const setUser = (user) => { //return this way
    return {
        type: SET_USER,
        payload: user
    };
};

export const removeUser = () => ({ //or return this way using ()
    type: REMOVE_USER
})

export const demoUser = (user) => ({
  type: LOGIN_DEMO_USER,
  payload: user
})

/** Thunk Action Creators */

export const login = (user) => async (dispatch) => {
    const {credential, password} = user;
    const response = await csrfFetch('/api/session', {
        method: "POST",
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };

  export const loginDemoUser = () => async (dispatch) => {
    try {
      const response = await csrfFetch('api/auth/demo', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(response.ok) {
        const demoUser = {
          credential: 'FakeUser1',
          password: 'password2'
        }

        await dispatch(login(demoUser))
        return response;
      } else {
        throw new Error('Failed to log in as the demo user.')
      }
    } catch (err) {
      throw err
    }
  }

/** Reducer*/
const initialState = {user: null}

const sessionReducer = (state = initialState, action) => {
    let newState;

    switch(action.type){
        case SET_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        case LOGIN_DEMO_USER:
          return {
            ...state,
            user: action.payload,
          }
        default:
            return state
    }
}

export default sessionReducer;
