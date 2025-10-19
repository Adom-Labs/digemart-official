import React from "react";
import { Input } from "../ui/input";
import { CheckCircle2, Clock, Info } from "lucide-react";
import { getPriorityColor } from "./utils";

function formatTime(time: string) {
  const formattedTime = new Date(time);

  return `${formattedTime.getFullYear()}-${formattedTime.getMonth()}-${formattedTime.getDate()}`;
}

const TaskCard = ({
  title,
  details,
  priority,
  time,
  tag,
  category,
}: {
  title: string;
  details: string;
  priority: string;
  time?: string;
  tag: string;
  category: string;
}) => {
  return (
    <article
      className={`flex gap-4 ${
        category === "completed" ? "bg-[#FDFDFD]" : "bg-white"
      }  p-4 min-h-40 rounded-2xl border border-[#E5E5E5]`}
    >
      <div>
        {category === "overdue" ? (
          <Info className="rotate-180" color="#FF4E4E" />
        ) : category === "completed" ? (
          <CheckCircle2 color="#64D18D" />
        ) : (
          <Input type="checkbox" className="w-5 h-5" />
        )}
      </div>
      <section className="space-y-2">
        <header className="flex justify-between ">
          <h5 className="font-semibold">
            {category === "completed" ? (
              <del className="text-[#C6C6C7]">{title}</del>
            ) : (
              title
            )}
          </h5>
          <span
            className={`px-2 h-fit rounded-lg text-white ${getPriorityColor(
              priority.toLowerCase()
            )}`}
          >
            {priority}
          </span>
        </header>
        <p className="text-[#706f77] font-medium">{details}</p>
        <div className="flex gap-4">
          {time && (
            <p
              className={`${
                category === "overdue" ? "text-[#FF1018]" : "text-[#706f77]"
              } flex items-center gap-2 font-bold`}
            >
              <Clock size={20} /> {formatTime(time)}
            </p>
          )}
          <p className="p-1 rounded-xl font-bold border border-[#E5E5E5]">
            {tag}
          </p>
        </div>
      </section>
    </article>
  );
};

export default TaskCard;
