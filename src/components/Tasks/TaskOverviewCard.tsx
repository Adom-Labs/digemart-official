import { getColor } from "./utils";

const TaskOverviewCard = ({
  title,
  number,
  id,
}: {
  title: string;
  number: number;
  id: string;
}) => {
  return (
    <article
      className={`p-6 space-y-4  ${getColor(id)} border-2 rounded-xl h-[116px]`}
    >
      <h4 className="font-semibold">{title}</h4>
      <p>{number}</p>
    </article>
  );
};

export default TaskOverviewCard;
