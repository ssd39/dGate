import React, { useEffect, useState } from "react";
import { Puff } from "react-loader-spinner";
import config from "../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setLogin] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [lEmail, setLEmail] = useState("");
  const [lPassword, setLPassword] = useState("");
  const navigate = useNavigate();

  const [sEmail, setSEmail] = useState("");
  const [sPassword, setSPassword] = useState("");
  const [sName, setSName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      navigate('/dashboard')
    }
  }, [])

  const login = async () => {
    setLoading(true);
    const res = await fetch(`${config.API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: lEmail, password: lPassword }),
    }).finally(() => setLoading(false));
    const resData = await res.json();
    if (res.status == 200) {
      const token = resData.token;
      toast.success("Authenticated sucessfully!");
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      toast.error(resData.message);
    }
  };

  const signUp = async () => {
    setLoading(true);
    const res = await fetch(`${config.API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: sEmail, password: sPassword, name: sName }),
    }).finally(() => setLoading(false));
    const resData = await res.json();
    if (res.status == 200) {
      const token = resData.token;
      toast.success("Account registered sucessfully!");
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      toast.error(resData.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="absolute h-screen w-screen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="16"
          height="16"
          fill="none"
        >
          <circle
            fill="${value}"
            id="pattern-circle"
            cx="10"
            cy="10"
            r="2.5"
          ></circle>
        </svg>
      </div>
      <span className="text-6xl font-bold text-blue-500">dGate</span>
      <div className="p-4 rounded-lg shadow-xl flex flex-col z-50">
        <div className="min-w-96 p-2 rounded-full shadow-inner flex items-center justify-around">
          <span
            onClick={() => setLogin(true)}
            className={`font-bold cursor-pointer text-2xl ${
              isLogin
                ? "bg-slate-700 p-2 px-4 rounded-full text-white"
                : "active:scale-90"
            }`}
          >
            Login
          </span>
          <span
            onClick={() => setLogin(false)}
            className={`font-bold cursor-pointer text-2xl ${
              !isLogin
                ? "bg-slate-700 p-2 px-4 rounded-full text-white"
                : "active:scale-90"
            }`}
          >
            Sign Up
          </span>
        </div>
        {isLogin && (
          <div className="w-full flex flex-col">
            <div className="flex flex-col w-full mt-4">
              <span className="font-bold text-xl">Email</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="email"
                value={lEmail}
                onChange={(e) => setLEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <span className="font-bold text-xl">Password</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="password"
                value={lPassword}
                onChange={(e) => setLPassword(e.target.value)}
              />
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
                  onClick={() => login()}
                  className="select-none rounded-full text-white text-3xl font-bold bg-slate-700 p-2 px-4 cursor-pointer active:scale-90"
                >
                  {">"}
                </div>
              )}
            </div>
          </div>
        )}
        {!isLogin && (
          <div className="w-full flex flex-col">
            <div className="flex flex-col w-full mt-4">
              <span className="font-bold text-xl">Name</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="text"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <span className="font-bold text-xl">Email</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="email"
                value={sEmail}
                onChange={(e) => setSEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <span className="font-bold text-xl">Password</span>
              <input
                className="p-2 px-4 bg-slate-200 rounded-lg"
                type="password"
                value={sPassword}
                onChange={(e) => setSPassword(e.target.value)}
              />
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
                  onClick={() => signUp()}
                  className="select-none rounded-full text-white text-3xl font-bold bg-slate-700 p-2 px-4 cursor-pointer active:scale-90"
                >
                  {">"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
