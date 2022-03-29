import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import { DecodedToken } from "../types";

const AuthedCard = ({ size }: any) => {
  const [decoded, setDecoded] = useState<DecodedToken>();

  useEffect(() => {
    try {
      setDecoded(jwtDecode(localStorage.faceit_token));
    } catch {}
  }, []);

  const onSignout = () => {
    localStorage.clear();
    window.location.reload();
  }

  if (!decoded) return null;

  return (
    <div className="auth-card">
      <div className="avatar w-20 rounded-md mr-4">
        <img src={decoded.picture} alt="profile" />
      </div>

      <p className="font-bold text-2xl">{decoded.nickname}</p>

      <img src={`https://flagcdn.com/${decoded.locale}.svg`} width="40" alt="flag"></img>

      <button className="btn btn-outline btn-accent" onClick={onSignout}>Sign out</button>
    </div>
  );
};

export default AuthedCard;
