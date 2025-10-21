import { getColor } from "./utils";
import { motion } from "framer-motion";

const TaskOverviewCard = ({
  title,
  number,
  id,
  index,
}: {
  title: string;
  number: number;
  id: string;
  index: number;
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      className={`p-6 space-y-4  ${getColor(id)} border-2 rounded-xl h-[116px]`}
    >
      <h4 className="font-semibold">{title}</h4>
      <p>{number}</p>
    </motion.article>
  );
};

export default TaskOverviewCard;
