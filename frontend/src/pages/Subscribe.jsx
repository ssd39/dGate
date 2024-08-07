import React, { useEffect, useState } from "react";
import { Puff } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";
import { BackgroundBeams } from "../components/BackgroundBeams";

export default function Subscribe() {
  const { id } = useParams();
  const [stage, setStage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [subDetails, setSubDetails] = useState({});
  const fetchSub = async (id_) => {
    const sub = await fetch(`${config.API}/subscription/${id_}`);
    const subData = await sub.json();
    setLoading(false);
    if (sub.status != 200) {
      toast.error(subData.message);

      return;
    }
    setSubDetails(subData.subscription);
  };
  useEffect(() => {
    if (id) {
      fetchSub(id);
    }
  }, [id]);
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {!isLoading && stage == 0 && (
        <div className="flex z-[1000] w-full justify-center mt-6 ">
          <div className="flex flex-col rounded-xl w-1/2 shadow-xl shadow-slate-700 p-4 bg-white">
            <span className="font-bold text-4xl">👋 Hi</span>
            <span className="text-xl mt-4">
              Join the community{" "}
              <span className="font-bold text-slate-700">
                {subDetails.name}
              </span>
            </span>
            <span className="text-xl mt-3 font-bold">
              🤔 What you will get?
            </span>
            <span className="mt-1 text-xl">
              {!subDetails?.isChannelBase
                ? "You will get the full of access of this discord server!"
                : ""}
            </span>
            <span className="text-xl mt-3 font-bold">✨ About community:</span>
            <span className="mt-1 text-xl">{subDetails.description}</span>
            <span className="text-xl mt-3 font-bold">🚪 Joining criteria:</span>
            <span className="mt-1 text-xl">No criteria requirement</span>
            <div className="flex justify-center mt-8 ">
              <div
                onClick={() => {
                  setStage(1);
                }}
                className="bg-slate-700 shadow-xl shadow-teal-200 text-white rounded-full font-bold p-2 px-4 cursor-pointer active:scale-90 select-none"
              >
                Subscribe at{" "}
                <span className="text-teal-500">
                  {subDetails.amount} {subDetails.token}
                </span>{" "}
                for{" "}
                <span className="text-teal-500">
                  {subDetails.durationCount}
                  {subDetails.durationType}
                </span>
              </div>
            </div>
            <span className="mt-6 flex items-center justify-center">
              <span className="text-slate-700 text-2xl font-bold">
                Powered by
              </span>
              <span className="ml-1 text-3xl font-bold text-blue-500">
                dGate
              </span>
            </span>
          </div>
        </div>
      )}
      {!isLoading && stage == 1 && (
        <>
          <div className="flex z-[1000] w-full justify-center mt-6 ">
            <div className="flex flex-col rounded-xl w-1/2 shadow-xl shadow-slate-700 p-4 bg-white">
              <span className="font-bold text-xl text-center">Import your <span className="text-teal-500">DIAMANTE</span> Wallet to pay <span className="text-teal-500">{subDetails.amount} {subDetails.token}</span></span>
            <div className="flex">
            <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="password"
                
              />
            </div>
            </div>
          </div>
        </>
      )}
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
      <BackgroundBeams />
    </div>
  );
}
