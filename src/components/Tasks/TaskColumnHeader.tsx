import { getColor } from "./utils";
import { motion } from "framer-motion";

const TaskColumnHeader = ({
  title,
  number,
  category,
  slxClass,
  index,
}: {
  title: string;
  number: number;
  category: string;
  slxClass?: string;
  index: number;
}) => {
  return (
    <motion.article
      className={`flex flex-col md:flex-row justify-between border ${getColor(
        category
      )} py-2 px-4 rounded-lg ${slxClass}`}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 * index }}
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
    </motion.article>
  );
};

export default TaskColumnHeader;
