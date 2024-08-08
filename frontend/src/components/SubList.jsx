import React from "react";
import { toast } from "react-toastify";
import ShareIcon from '@mui/icons-material/Share';
import config from "../config";

export default function SubList({ subList }) {
  return (
    <>
      <div className="flex">
        {subList.map((v, i) => {
          return (
            <div
            onClick={()=> {}}
              key={`sublist_${i}`}
              className="select-none flex-col cursor-pointer active:scale-90 w-80 p-2 border  shadow-lg shadow-blue-200 rounded-xl mx-2 h-36"
            >
              <span className="font-bold text-lg text-slate-700">{v.name}</span>
              <div className="flex">
                <span>
                  <span className="font-bold">Fees:</span> {v.amount} {v.token}
                </span>
                <span className="ml-6">
                  <span className="font-bold">Duration:</span> {v.durationCount}{" "}
                  {v.durationType}
                </span>
              </div>
              <div className="mt-1 overflow-clip">
                <span>{v.description}</span>
              </div>
              <div className="flex">
                <div className="shadow-inner rounded-full p-1">
                  <img height={32} width={32} src="/discord.png" />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    toast.success("Subscription link copied to clipboard!");
                    navigator.clipboard.writeText(`${config.URL}/subscribe/${v._id}`);  
                }}
                  className="ml-2  text-white flex items-center font-bold shadow-xl active:scale-90 cursor-pointer rounded-full"
                >
                  <span className="bg-slate-700 p-0.5 text-sm rounded-full">
                    <ShareIcon />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
