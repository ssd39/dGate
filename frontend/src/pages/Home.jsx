import React from "react";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../components/HeroHighLight";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen px-6 p-4 flex-col">
      <div className="flex justify-between items-center">
        <span className="text-8xl font-bold text-blue-500">dGate</span>
        <div>
          <div
            onClick={() => navigate("/auth")}
            className="bg-slate-700 text-white rounded-md font-bold p-2 px-4 cursor-pointer active:scale-90 select-none"
          >
            Login / SignUp
          </div>
        </div>
      </div>
      <div className="mt-3 flex-1 flex flex-wrap">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700  max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
          >
            A Web3 solution to monetize and enrich your groups and channels on
            social platforms.
            <Highlight className="text-black">
              It's like the Shopify of the Discord, Telegram, and Slack.
            </Highlight>
          </motion.h1>
        </HeroHighlight>
        <div className="flex flex-col ml-4">
          <div className="rounded-lg border-[rgba(0,0,0,0.05)] border-2 flex-1 mb-4 p-4 flex flex-col shadow-lg">
            <div className="flex-1 mb-2 flex items-center justify-center">
              <div className="flex-1 flex items-center justify-center">
                <img src="/dollar-dollar-color.png" height={96} width={96} />
              </div>
              <p className="text-neutral-700 max-w-60 shadow-inner p-2 rounded-lg text-justify">
                We help you to accept payments in multiple tokens easy, fast &
                secure manner.
              </p>
            </div>
            <span className="text-xl font-bold bg-blue-500 rounded-md p-0.5 px-2 text-white">
              Payments Handled For You
            </span>
          </div>
          <div className="rounded-lg border-[rgba(0,0,0,0.05)] border-2 flex-1 mb-4 p-4 flex flex-col shadow-lg">
            <div className="flex-1 mb-2 flex items-center justify-center">
              <div className="flex-1 flex items-center justify-center">
                <img src="/lock-dynamic-color.png" height={96} width={96} />
              </div>
              <p className="text-neutral-700 max-w-60 shadow-inner p-2 rounded-lg text-justify">
                We'll handle adding/removing members from channels based on
                their subscription status
              </p>
            </div>
            <span className="text-xl font-bold bg-blue-500 rounded-md p-0.5 px-2 text-white">
              Automatic Permissions, Roles & Invites
            </span>
          </div>
          <div className="rounded-lg border-[rgba(0,0,0,0.05)] border-2 flex-1 mb-4 p-4 flex flex-col shadow-lg">
            <div className="flex-1 mb-2 flex items-center justify-center">
              <div className="flex-1 flex items-center justify-center">
                <img src="/puzzle.png" height={96} width={96} />
              </div>
              <p className="text-neutral-700 max-w-60 shadow-inner p-2 rounded-lg text-justify">
                Marketplace of tools to add functionality and utility to your
                community, developed collaboratively by the DAO and us.
              </p>
            </div>
            <span className="text-xl font-bold bg-blue-500 rounded-md p-0.5 px-2 text-white">
              Integrations
            </span>
          </div>
          <div className="rounded-lg border-[rgba(0,0,0,0.05)] border-2 flex-1 p-4 flex flex-col shadow-lg">
            <div className="flex-1 mb-2 flex items-center justify-center">
              <div className="flex-1 flex items-center justify-center">
                <img src="/locker.png" height={96} width={96} />
              </div>
              <p className="text-neutral-700 max-w-60 shadow-inner p-2 rounded-lg text-justify">
                Limit user subscriptions using various parameters or through a
                Q&A form powered by privacy-preserving AI.
              </p>
            </div>
            <span className="text-xl font-bold bg-blue-500 rounded-md p-0.5 px-2 text-white">
              Privacy Driven Constraints
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
