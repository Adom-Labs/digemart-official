import { Check, CircleCheck, Info, Trash2 } from "lucide-react";
import React from "react";

function formatDate(date: string) {
  const formattedDate = new Date(date);
  const month = formattedDate.toDateString().split(" ")[1];

  return `${month} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;
}

const NotificationCard = ({
  isPending,
  title,
  details,
  status,
  date,
}: {
  isPending: boolean;
  title: string;
  details: string;
  status: string;
  date: string;
}) => {
  return (
    <article className="flex flex-col sm:flex-row bg-white py-6 sm:py-10 px-4 sm:px-6 rounded-2xl gap-3 sm:gap-4">
      <div className="bg-[#F3F4F7] h-fit p-2 rounded-xl w-fit">
        {isPending ? <Info color="#3A6AF9" /> : <CircleCheck color="#00C483" />}
      </div>
      <section className="flex-1 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl">{title}</h3>
            <p className="font-semibold text-[#828FA1] text-sm sm:text-base">
              {details}
            </p>
          </div>
          {status.toLowerCase() === "unread" && (
            <span className="bg-[#0301A0] px-3 py-1 rounded-full h-fit text-white text-sm w-fit">
              New
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <p className="text-xs sm:text-sm text-[#C6C7D0] font-semibold">
            {formatDate(date)}
          </p>
          <div
            className={`flex gap-4 sm:gap-6 items-center ${
              status.toLowerCase() === "unread"
                ? "justify-between"
                : "justify-end"
            }`}
          >
            {status.toLowerCase() === "unread" && (
              <p className="flex items-center text-blue-900 gap-2 font-medium text-sm sm:text-base">
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Mark as read</span>
                <span className="xs:hidden">Mark read</span>
              </p>
            )}
            <button className="hover:cursor-pointer text-[#FF5F6E]">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </section>
    </article>
  );
};

export default NotificationCard;
