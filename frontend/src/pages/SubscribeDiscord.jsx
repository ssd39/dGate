import React, { useEffect, useState } from "react";
import { Puff } from "react-loader-spinner";
import { BackgroundBeams } from "../components/BackgroundBeams";
import { toast } from "react-toastify";
import config from "../config";

export default function SubscribeDiscord() {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const fetchDiscord = async (code) => {
    setLoading(true);
    const data = JSON.parse(localStorage.getItem("subme"));
    const discordConnect = await fetch(`${config.API}/discord_connect_sub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    const discordData = await discordConnect.json();
    console.log(discordData);
    if (discordConnect.status != 200) {
      setLoading(false);
      return toast.error(discordData.message);
    }

    const access_token = discordData?.access_token;
    const reqBody = {
      subId: data.subId,
      txHash: data.txHash,
      memo: data.memo,
      discordId: discordData?.username,
      email: discordData?.email,
      access_token,
      discordInternalID :discordData.id
    };
    const finRes = await fetch(`${config.API}/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    const finResJsn = await finRes.json()
    if(finRes.status != 200){
        toast.error(finResJsn.message)
        setLoading(false)
        return
    }
    toast.success("You are added to the server/community!");
    setLoading(false);
    setSuccess(true)
    localStorage.removeItem('subme')
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("code")) {
      fetchDiscord(searchParams.get("code"));
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {isLoading && (
        <div className="flex z-[1000] w-full justify-center mt-6">
          <Puff
            visible={true}
            height="64"
            width="44"
            color="#334155"
            ariaLabel="puff-loading"
          />
        </div>
      )}
      {isSuccess && (
        <div className="flex z-[1000] w-full justify-center mt-6 ">
          <div className="flex flex-col rounded-xl w-1/2 shadow-xl shadow-slate-700 p-4 bg-white">
            <span className="text-center text-xl font-bold">
              You joined the server{" "}
              <span className="text-teal-500">successfully</span>!
            </span>
          </div>
        </div>
      )}
      <BackgroundBeams />
    </div>
  );
}
