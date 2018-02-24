import axios from 'axios';

const URL = 'http://127.0.0.1/api/v1/';
export const AUTHENTICATED = 'AUTHENTICATED';
export const UNAUTHENTICATED = 'UNAUTHENTICATED';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';


export function login({username, password}, history) {
    return {
        type: 'LOGIN',
        username,
        password,
    }
}



export function signInAction({ email, password }, history) {
    return async (dispatch) => {
        try {
            const res = await axios.post(`${URL}/login`, { email, password });

            dispatch({ type: AUTHENTICATED });
            localStorage.setItem('user', res.data.token);
            history.push('/secret');
        } catch(error) {
            dispatch({
                type: AUTHENTICATION_ERROR,
                payload: 'Invalid email or password'
            });
        }
    };
}