import React from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { DecodedToken } from "../types";

function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Auth = () => {
    const query = useQuery();
    const navigate: NavigateFunction = useNavigate();

    React.useEffect(() => {
        const token: string|null = query.get('token');
        const id_token: string|null = query.get('id_token')

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