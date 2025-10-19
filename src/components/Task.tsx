import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TaskDropDownMenu from "./TaskDropDownMenu";
import { useState } from "react";

const taskFilterOptions = [
  "All Tasks",
  " Pending Task",
  "Overdue Task",
  "  Completed Task",
];

const taskTypeOptions = ["All Types", "Purchases", "Sales", "Loans"];

const Task = () => {
  const [taskFilter, setTaskFilter] = useState(taskFilterOptions[0]);
  const [taskType, setTaskType] = useState(taskTypeOptions[0]);

  return (
    <>
      <header>
        <h2>Tasks</h2>
        <div>
          <p>Manage nd track your tasks across all stores</p>
          <Button>
            <Plus />
            Create Task
          </Button>
        </div>
      </header>
      <div className="flex gap-6">
        <Input type="search" />
        <TaskDropDownMenu
          currentFilter={taskFilter}
          options={taskFilterOptions}
          setFilter={setTaskFilter}
        />
        <TaskDropDownMenu
          currentFilter={taskType}
          options={taskTypeOptions}
          setFilter={setTaskType}
        />
      </div>
    </>
  );
};

export default Task;
