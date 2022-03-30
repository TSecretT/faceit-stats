import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthedCard } from "../components";
import config from "../config";

import utils from "../utils";

const Home = () => {
  const [url, setURL] = React.useState<string>("");

  const navigate = useNavigate();

  const search = () => {
    if (!url) return;
    const id = utils.trimURL(url);
    navigate("/match/" + id);
    utils.addLastSearched(id);
  };

  const onFaceitLogin = () => {
    const client_id: string = config.DEV? "e49a78de-e297-4bd1-9aad-d78940e3c6ba" : "d12c88f9-bd7c-4d03-8144-d319015e5d14";
    const url: string = `https://accounts.faceit.com/?client_id=${client_id}&redirect_popup=true&response_type=token`
    window.open(url, '_blank', 'noopener,noreferrer')
  };



  return (
    <div className="page">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md flex flex-col">
            <h1 className="text-5xl font-bold">Faceit Tips</h1>
            <p className="py-6">{config.WELCOME_MESSAGE}</p>

            <input
              placeholder="Match ID or URL"
              className="match-id-input"
              onChange={(e) => {
                setURL(e.target.value);
              }}
            />
            <button className="btn btn-primary" onClick={search}>
              Analyze
            </button>
            {utils.authed()? 
                <AuthedCard size="large" />
                :
                <button className="btn btn-accent my-4" onClick={onFaceitLogin}>Connect faceit profile</button>
            }

            <p className="text-secondary">Beta v{config.VERSION}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
