export const taskFilterOptions = [
  "All Tasks",
  " Pending Task",
  "Overdue Task",
  "  Completed Task",
];

export const taskTypeOptions = ["All Types", "Purchases", "Sales", "Loans"];

export const taskCategories = [
  { title: "To Do", number: 2, id: "pending" },
  { title: "Overdue", number: 1, id: "overdue" },
  { title: "Completed", number: 1, id: "completed" },
  { title: "Total Tasks", number: 4, id: "all" },
];

export const tasks = [
  {
    category: "pending",
    title: "To do",
    number: 2,
    tasks: [
      {
        title: "Complete Store Verification",
        details: "Submit required documents to verify your business listing",
        time: "2025-10-16T13:39:15.536Z",
        tag: "Onboarding",
        priority: "High",
      },
      {
        title: "Add product image",
        details: "Upload high-quality images for your top ten products",
        tag: "Completion",
        priority: "Medium",
      },
    ],
  },
  {
    category: "overdue",
    title: "Overdue",
    number: 1,
    tasks: [
      {
        title: "Set up payment gateway",
        details: "Configure your preferred payment method for e-commerce store",
        time: "2025-10-12T13:39:15.536Z",
        tag: "Setup",
        priority: "High",
      },
    ],
  },
  {
    category: "completed",
    title: "Completed",
    number: 1,
    tasks: [
      {
        title: "Update business hours",
        details: "Ensure your operating hours are current and accurate",
        tag: "Completion",
        priority: "low",
      },
    ],
  },
];

export function getColor(id: string) {
  switch (id) {
    case "pending":
      return "bg-[#EEF5FF] border-[#B8D7FF] text-[#6369F8]";
    case "overdue":
      return "bg-[#FFF1F2] border-[#FFC4C7] text-[#EE502F]";
    case "completed":
      return "bg-[#EBFFF4] border-[#9BFFD1] text-[#1E9239]";
    case "all":
      return "bg-[#FCF3FF] border-[#F2CBFF] text-[#B042ED]";
    default:
      return "";
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-[#EE0028]";
    case "medium":
      return "bg-[#FF5300]";
    case "low":
      return "bg-[#F1F3F6] text-[#74717C]";
    default:
      return "";
  }
}
