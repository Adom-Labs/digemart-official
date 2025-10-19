import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";

const TaskDropDownMenu = ({
  currentFilter,
  options,
  setFilter,
}: {
  currentFilter: string;
  options: string[];
  setFilter: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-accent w-72 bg-[#F3F3F5] hover:cursor-pointer flex justify-between h-fit"
        >
          {currentFilter}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-50">
        {options.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={`text-foreground hover:bg-accent ${
              currentFilter === item ? "bg-accent" : ""
            }  hover:text-accent-foreground cursor-pointer`}
            onClick={() => setFilter(item)}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskDropDownMenu;
