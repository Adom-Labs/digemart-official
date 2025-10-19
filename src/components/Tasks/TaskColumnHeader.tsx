import { getColor } from "./utils";

const TaskColumnHeader = ({
  title,
  number,
  category,
  slxClass,
}: {
  title: string;
  number: number;
  category: string;
  slxClass?: string;
}) => {
  return (
    <article
      className={`flex flex-col md:flex-row justify-between border ${getColor(
        category
      )} py-2 px-4 rounded-lg ${slxClass}`}
    >
      <h4 className="font-medium">{title}</h4>
      <p
        className={`w-6 h-6 flex justify-center rounded-md items-center text-white ${
          category === "pending"
            ? "bg-[#315CFF]"
            : category === "overdue"
            ? "bg-[red]"
            : category === "completed"
            ? "bg-[#00DB57]"
            : ""
        }`}
      >
        {number}
      </p>
    </article>
  );
};

export default TaskColumnHeader;
