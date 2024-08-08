import React, { useEffect, useState } from "react";
import { Puff } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";
import { BackgroundBeams } from "../components/BackgroundBeams";
import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Memo,
  Networks,
  NotFoundError,
  Operation,
  TransactionBuilder,
} from "diamante-sdk-js";
import { makeid } from "../lib/utils";

export default function Subscribe() {
  const { id } = useParams();
  const [stage, setStage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [subDetails, setSubDetails] = useState({});
  const [walletPk, setWalletPk] = useState("");
  const [memo, setMemo] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isDiamWallet, setDiamWallet] = useState(false);

  useEffect(() => {
    console.log("diam_wallet", window.diam);
    if (window.diam) {
      setDiamWallet(true);
    }
  }, [window.diam]);

  const pay = async () => {
    if (walletPk != "" || isDiamWallet) {
      try {
        setLoading(true);
        const wid = makeid(10);
        setMemo(wid);
        const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");

        let account = null;
        let pair = null;
        if (isDiamWallet) {
          const walletData = await window.diam.connect();
          console.log(walletData)
          account = await server
            .loadAccount(walletData.message[0])
            .catch((error) => {
              if (error instanceof NotFoundError) {
                toast.error("Wallet not found!");
              }
              throw error;
            });
        } else {
          pair = Keypair.fromSecret(walletPk);
          account = await server
            .loadAccount(pair.publicKey())
            .catch((error) => {
              if (error instanceof NotFoundError) {
                toast.error("Wallet not found!");
              }
              throw error;
            });
        }

        const transaction = new TransactionBuilder(account, {
          fee: BASE_FEE,
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(
            Operation.payment({
              destination:
                "GC3MLUC4MQ36AXNGR2JSCCRKQNZ3V4MH67LYTJGBCVZPNECDVNRZW3RV",

              asset:
                subDetails.token == "DIAM"
                  ? Asset.native()
                  : new Asset(subDetails.token),
              amount: subDetails.amount.toString(),
            })
          )
          .addMemo(Memo.text(wid))
          .setTimeout(180)
          .build();

        let txRes = null;
        if (!isDiamWallet) {
          transaction.sign(pair);
          txRes = await server.submitTransaction(transaction);
        } else {
          txRes = (await window.diam.sign(transaction.toEnvelope().toXDR('base64'), true, "Diamante Testnet")).response.message;
        }
        console.log("txRes", txRes);
        // And finally, send it off to Diamante!
        setTxHash(txRes.hash);
        setStage(2);
        toast.success("Subscription fees paid sucessfully!");
      } catch (e) {
        console.error(e);
        toast.error("Error while importing wallet!");
      }
      setLoading(false);
    }
  };
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

  const loginWithDiscord = () => {
    localStorage.setItem(
      "subme",
      JSON.stringify({
        subId: id,
        txHash,
        memo,
      })
    );
    window.open(
      `https://discord.com/oauth2/authorize?client_id=1270612842524971091&response_type=code&redirect_uri=${config.URL}/discord-verification&scope=identify+guilds.join+email`
    );
  };
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
              {!isDiamWallet ? (
                <>
                  <span className="font-bold text-xl text-center">
                    Import your <span className="text-teal-500">DIAMANTE</span>{" "}
                    Wallet to pay{" "}
                    <span className="text-teal-500">
                      {subDetails.amount} {subDetails.token}
                    </span>
                  </span>
                  <div className="flex w-full mt-4 flex-col ">
                    <span className="text-lg font-bold">
                      Wallet's Private Key
                    </span>
                    <input
                      className="p-2 px-4 bg-slate-200 rounded-lg"
                      type="password"
                      value={walletPk}
                      onChange={(e) => setWalletPk(e.target.value)}
                    />
                    <div className="flex justify-center">
                      <div
                        onClick={async () => pay()}
                        className="mt-4 bg-slate-700 shadow-xl shadow-teal-200 text-white rounded-full font-bold p-2 px-4 cursor-pointer active:scale-90 select-none"
                      >
                        Import & Pay
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-bold text-xl text-center">
                    Connect your <span className="text-teal-500">DIAMANTE</span>{" "}
                    Wallet to pay{" "}
                    <span className="text-teal-500">
                      {subDetails.amount} {subDetails.token}
                    </span>
                  </span>
                  <div className="flex w-full mt-4 flex-col ">
                    <div className="flex justify-center">
                      <div
                        onClick={async () => pay()}
                        className="mt-4 bg-slate-700 shadow-xl shadow-teal-200 text-white rounded-full font-bold p-2 px-4 cursor-pointer active:scale-90 select-none"
                      >
                        Connect & Pay
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {!isLoading && stage == 2 && (
        <>
          <div className="flex z-[1000] w-full justify-center mt-6 ">
            <div className="flex flex-col rounded-xl w-1/2 shadow-xl shadow-slate-700 p-4 bg-white">
              <span className="text-center text-xl font-bold">
                Wooho!🥳 You subscribed{" "}
                <span className="text-teal-500">{subDetails.name}</span>{" "}
                sucessfully. Now login with discord to join the server.
              </span>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => loginWithDiscord()}
                  className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200  active:scale-90"
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="800px"
                    height="800px"
                    viewBox="0 -28.5 256 256"
                    version="1.1"
                    preserveAspectRatio="xMidYMid"
                  >
                    <g>
                      <path
                        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                        fill="#5865F2"
                      ></path>
                    </g>
                  </svg>

                  <span>Login with Discord</span>
                </button>
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
