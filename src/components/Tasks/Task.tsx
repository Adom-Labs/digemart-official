import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import TaskDropDownMenu from "./TaskDropDownMenu";
import { useState } from "react";
import {
  taskCategories,
  taskFilterOptions,
  tasks,
  taskTypeOptions,
} from "./utils";
import TaskOverviewCard from "./TaskOverviewCard";
import TaskColumnHeader from "./TaskColumnHeader";
import TaskCard from "./TaskCard";

const Task = () => {
  const [taskFilter, setTaskFilter] = useState(taskFilterOptions[0]);
  const [taskType, setTaskType] = useState(taskTypeOptions[0]);

  return (
    <>
      <header className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl">Tasks</h2>
            <p>Manage and track your tasks across all stores</p>
          </div>
          <Button className="bg-black hover:cursor-pointer hidden md:block hover:bg-black/80 transition-all duration-200">
            <Plus />
            Create Task
          </Button>
          <Button className="bg-black">
            <Plus />
          </Button>
        </div>

        <div className="flex md:gap-6 md:flex-row flex-col gap-4">
          <div className="relative flex-2">
            <Search className="absolute top-[0.37rem] left-2" size={24} />

            <Input
              type="search"
              placeholder="Search tasks..."
              className="bg-[#F3F3F5] px-12"
              autoFocus
            />
          </div>
          <div className="flex gap-6">
            <TaskDropDownMenu
              currentFilter={taskFilter}
              options={taskFilterOptions}
              setFilter={setTaskFilter}
              // slxClass="hidden md:flex"
            />
            <TaskDropDownMenu
              currentFilter={taskType}
              options={taskTypeOptions}
              setFilter={setTaskType}
              // slxClass="hidden md:flex"
            />
          </div>
        </div>
      </header>
      <section>
        <header className="grid grid-cols-2 lg:grid-cols-4 gap-4 space-y-4">
          {taskCategories.map((item) => (
            <TaskOverviewCard key={item.id} {...item} />
          ))}
        </header>
        <section className="grid md:grid-cols-3 gap-4 grid-rows-3">
          {tasks.map((item) => (
            <div key={item.category} className="space-y-2">
              <TaskColumnHeader {...item} slxClass="sticky top-0 md:static" />
              <div className="space-y-4">
                {item.tasks.map((taskItem, index) => (
                  <TaskCard
                    key={index}
                    {...taskItem}
                    category={item.category}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default Task;
