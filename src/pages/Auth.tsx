import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { DecodedToken } from "../types";
import queryString from 'query-string';


const Auth = () => {
    const navigate: NavigateFunction = useNavigate();

    React.useEffect(() => {
        const { token, id_token }: any = queryString.parse(window.location.hash);

        if (token && id_token){
            try{
                localStorage.setItem('faceit_id', token)
                localStorage.setItem('faceit_token', id_token)
                const decoded: DecodedToken = jwt_decode(id_token);
                // send api to server

            } catch(err){
                console.error(err)
            }
        }
        navigate('/');
    }, [])

  return null;
}

export default Auth;