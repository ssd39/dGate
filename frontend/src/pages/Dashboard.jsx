import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { getAuthHeader } from "../store/userSlice";
import { toast } from "react-toastify";
import SubList from "../components/SubList";
import { Puff } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubList } from "../store/subscriptionsSlice";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const subList = useSelector((state) => state.subscriptions.subList);
  useEffect(() => {
    setLoading(true)
    dispatch(fetchSubList()).then(() => setLoading(false));
  }, []);
  useEffect(() => { console.log(subList)}, [subList])
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col flex-1 mt-6 p-2 px-4 rounded-lg m-2 shadow-2xl ">
        <div className="flex flex-col">
          <span className="text-2xl font-bold border-b-2">
            Manage Subscriptions
          </span>
          <div className="flex mt-4">
            <div
              onClick={() => {
                navigate("/create-subscription");
              }}
              className="bg-slate-700 text-white rounded-md font-bold p-2 px-4 cursor-pointer active:scale-90 select-none flex items-center "
            >
              <AddIcon className="mr-2" /> Create Subscription
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mt-4">
          <div className="w-full flex justify-center">
            <Puff
              visible={isLoading}
              height="64"
              width="44"
              color="#334155"
              ariaLabel="puff-loading"
            />
          </div>

          {!isLoading && <SubList subList={subList} />}
       
        </div>
      </div>
    </div>
  );
}
