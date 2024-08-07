import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import config from "../config";
import { toast } from "react-toastify";
import { getAuthHeader } from "../store/userSlice";
import ConstrainsList from "../components/ConstrainsList";

const animatedComponents = makeAnimated();

export default function CreateSubscription() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [durationType, setDurationType] = useState("M");
  const [durationAmount, setDurationAmount] = useState("");
  const [tokenType, setTokenType] = useState("DIAM");
  const [isChannelLevel, setChannelLevel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [channelList_, setChannelList] = useState([]);
  const [stage, setStage] = useState(0);
  const [guildId, setGuildID] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [description, setDescription] = useState("");
  const [customConstrain, setCustomConstrain] = useState([]);
  const [identifyConstrain, setIdentityCOnstrain] = useState([])
  const [isCustomConstrain, setIsCustomConstrain] = useState(false);
  const [walletAddress, setWalletAddress] = useState("")

  const loginWithDiscord = () => {
    window.open(
      "https://discord.com/oauth2/authorize?client_id=1270612842524971091&permissions=8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcreate-subscription&integration_type=0&scope=identify+bot"
    );
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("code")) {
      fetchDiscord(searchParams.get("code"));
    }
  }, []);

  const fetchChannels = async (guildId_) => {
    setLoading(true);
    const channelList = await fetch(
      `${config.API}/dashboard/discord_channels/${guildId_}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    ).finally(() => setLoading(false));
    const channelListData = await channelList.json();
    if (channelList.status != 200) {
      toast.error(channelListData.message);
      return;
    }
    setChannels(
      channelListData.userChannels.map((v) => {
        return { label: v.name, value: v.id };
      })
    );
    setStage(1);
  };

  const fetchDiscord = async (code) => {
    setLoading(true);
    const discordConnect = await fetch(
      `${config.API}/dashboard/discord_connect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ code }),
      }
    );
    const discordData = await discordConnect.json();

    if (discordConnect.status != 200) {
      setLoading(false);
      return toast.error(discordData.message);
    }

    const guildId_ = discordData?.guild?.id;
    const access_token = discordData?.access_token;
    const refresh_token = discordData?.refresh_token;
    const name_ = discordData?.guild?.name;

    console.log(guildId_, access_token, refresh_token, name_);
    if (!access_token || !guildId_ || !refresh_token || !name_) {
      console.log(discordData);
      setLoading(false);
      return;
    }

    setName(name_);
    setGuildID(guildId_);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    fetchChannels(guildId_);
  };

  const createSubscription = async () => {
    setLoading(true)
    const subc = await fetch(`${config.API}/dashboard/create_subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        name,
        amount,
        token: tokenType,
        description,
        walletAddress,
        durationType,
        durationCount: durationAmount,
        guildId,
        isChannelBase: isChannelLevel,
        channelList: channelList_,
        constrains: {
          customConstrain,
          identifyConstrain
        },
      })
    })
    const subcData = await subc.json()
    if(subc.status != 200 ){
      toast.error(subcData.message)
      setLoading(false)
      return
    }
    toast.success("Subscription created sucessfully!")
    navigate('/dashboard')
  }

  return (
    <div>
      <Header />
      <div className="flex mt-6 items-center ">
        <div
          onClick={() => {
            navigate("/dashboard");
          }}
          className="ml-4 bg-slate-700 text-white  p-2 px-4 text-xl font-bold shadow-xl active:scale-90 cursor-pointer rounded-full"
        >
          {"<"}
        </div>
        <span className="ml-3 font-bold text-2xl">New Subscription</span>
      </div>
      {stage == 1 && (
        <div className="flex w-full justify-center mt-4">
          <div className="w-1/2 shadow-lg rounded-xl p-4">
            <div className="flex flex-col">
              <span className="text-xl font-bold">Name</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">Description</span>
              <textarea
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="text"
                value={description}
                rows={2}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xl font-bold">Token</span>
              <select
                className="p-2.5 bg-slate-200 px-4 rounded-lg"
                value={tokenType}
                onChange={(e) => setTokenType(e.target.value)}
              >
                <option value="DIAM">DIAM</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xl font-bold">Amount</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="text"
                value={amount}
                placeholder={`(${tokenType})`}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xl font-bold">Wallet Address</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="text"
                value={walletAddress}
                placeholder={`(Diamante Wallet Address)`}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-xl font-bold">Duration</span>
              <div>
                <input
                  className="p-2 px-4 bg-slate-200 rounded-lg"
                  type="text"
                  value={durationAmount}
                  placeholder={
                    durationType == "D"
                      ? "(Days)"
                      : durationType == "M"
                      ? "(Months)"
                      : durationType == "Y"
                      ? "(Year)"
                      : ""
                  }
                  onChange={(e) => setDurationAmount(e.target.value)}
                />
                <select
                  className="p-2.5 bg-slate-200 px-4 rounded-lg ml-2"
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                >
                  <option value="D">Day</option>
                  <option value="M">Month</option>
                  <option value="Y">Year</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <div className="flex items-center">
                <input
                  className="p-2 px-4 h-5 w-5 bg-slate-200 rounded-2xl text-2xl"
                  type="checkbox"
                  checked={isChannelLevel}
                  onChange={(e) => setChannelLevel(!isChannelLevel)}
                />
                <span className="text-xl font-bold ml-2">
                  Channel level invitation
                </span>
              </div>
              {isChannelLevel && (
                <>
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={channels}
                    onChange={(e) => setChannelList(e)}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor:
                          "rgb(226 232 240 / var(--tw-bg-opacity))",
                        borderRadius: "0.5rem",
                      }),
                      multiValue: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: "white",
                      }),
                    }}
                    className="bg-slate-700 rounded-2xl"
                  />
                </>
              )}
            </div>
            <div className="flex items-center justify-center mt-4">
              {isLoading ? (
                <Puff
                  visible={true}
                  height="64"
                  width="44"
                  color="#334155"
                  ariaLabel="puff-loading"
                />
              ) : (
                <div
                  onClick={() => {
                    setStage(2)
                  }}
                  className="select-none rounded-full text-white text-3xl font-bold bg-slate-700 p-2 px-4 cursor-pointer active:scale-90"
                >
                  {">"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {stage == 0 && (
        <div className="flex w-full justify-center mt-4">
          <div className="w-1/2 shadow-lg rounded-xl p-4">
            <div className="flex flex-col mt-2">
              <span className="text-xl font-bold">Social Platform</span>
              <select
                className="p-2.5 bg-slate-200 px-4 rounded-lg"
                value={""}
               // onChange={(e) => setPlatfrom(e.target.value)}
              >
                <option value="Discord">Discord</option>
                <option value="Telegram">Telegram</option>
                <option value="Slack">Slack</option>
              </select>
            </div>
            {!isLoading && (
              <div className="flex flex-col mt-2 items-center justify-center">
                <div>
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
            )}
            {isLoading && (
              <div className="flex items-center justify-center">
                <Puff
                  visible={true}
                  height="64"
                  width="44"
                  color="#334155"
                  ariaLabel="puff-loading"
                />
              </div>
            )}
          </div>
        </div>
      )}
      {stage == 2 && (
        <div className="flex w-full justify-center mt-4">
          <div className="w-1/2 shadow-lg rounded-xl p-4">
            <span>
              Add constrains to gate the subscription for specific audience
            </span>
            <div className="flex items-center">
              <input
                className="p-2 px-4 h-5 w-5 bg-slate-200 rounded-2xl text-2xl"
                type="checkbox"
                checked={isChannelLevel}
                onChange={(e) => setChannelLevel(!isChannelLevel)}
              />
              <span className="text-xl font-bold ml-2">
                Identity Constrains
              </span>
            </div>
            <div className="flex items-center">
              <input
                className="p-2 px-4 h-5 w-5 bg-slate-200 rounded-2xl text-2xl"
                type="checkbox"
                checked={isCustomConstrain}
                onChange={(e) => setIsCustomConstrain(!isCustomConstrain)}
              />
              <span className="text-xl font-bold ml-2">Custom Constrain</span>
            </div>
            {isCustomConstrain && (
              <>
                <div className="flex">
                  <div
                    onClick={() => {
                      setCustomConstrain([
                        ...customConstrain,
                        { question: "", answer: "" },
                      ]);
                      console.log(customConstrain);
                    }}
                    className="bg-slate-700 text-white rounded-md font-bold p-2 px-4 cursor-pointer active:scale-90 select-none"
                  >
                    Add
                  </div>
                </div>
                <ConstrainsList
                  constrainsList={customConstrain}
                  onChange={(k, v) => {
                    setCustomConstrain([
                      ...customConstrain.slice(0, k),
                      v,
                      ...customConstrain.slice(k + 1, customConstrain.length),
                    ]);
                  }}
                />
              </>
            )}

            {isLoading && (
              <div className="flex items-center justify-center">
                <Puff
                  visible={true}
                  height="64"
                  width="44"
                  color="#334155"
                  ariaLabel="puff-loading"
                />
              </div>
            )}
            {!isLoading && (
              <div className="flex items-center justify-center">
                <div
                  onClick={() => {
                    createSubscription()
                  }}
                  className="select-none rounded-full text-white text-3xl font-bold bg-slate-700 p-2 px-4 cursor-pointer active:scale-90"
                >
                  {">"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
