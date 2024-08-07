import React from "react";

export default function ConstrainsList({ constrainsList, onChange }) {
  return (
    <>
      {constrainsList.map((v, i) => {
        return (
          <div className="flex flex-col">
            <span className="text-xl font-bold">Question:</span>
            <input
              className="p-2 px-4 bg-slate-200 rounded-lg"
              type="text"
              value={v.question}
              onChange={(e) => {
                onChange(i, { ...v, question: e.target.value });
              }}
            />
            <span className="text-xl font-bold">Possible Answer:</span>
            <input
              className="p-2 px-4 bg-slate-200 rounded-lg"
              type="text"
              value={v.answer}
              onChange={(e) => {
                onChange(i, { ...v, answer: e.target.value });
              }}
            />
          </div>
        );
      })}
    </>
  );
}
