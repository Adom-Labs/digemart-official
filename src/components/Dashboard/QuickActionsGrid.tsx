import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StoreIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  ArrowRightIcon,
} from "lucide-react";
import { ViewMode } from "./ViewModeToggle";

interface QuickActionsGridProps {
  viewMode?: ViewMode;
}

export function QuickActionsGrid({ viewMode = "all" }: QuickActionsGridProps) {
  const allActions = [
    {
      icon: StoreIcon,
      title: "List Your Business",
      description:
        "Add your business to local directories and reach more customers",
      cta: "Create Listing",
      color: "text-green-600",
      type: "listing" as const,
    },
    {
      icon: ShoppingCartIcon,
      title: "Create E-commerce Store",
      description: "Launch your online store and start selling products today",
      cta: "Create Store",
      color: "text-orange-600",
      type: "ecommerce" as const,
    },
    {
      icon: BarChart3Icon,
      title: "View Analytics",
      description:
        "Track performance metrics and insights across all your stores",
      cta: "View Analytics",
      color: "text-primary",
      type: "general" as const,
    },
  ];

  const getFilteredActions = () => {
    if (viewMode === "listings") {
      return allActions.filter(
        (action) => action.type === "listing" || action.type === "general"
      );
    } else if (viewMode === "ecommerce") {
      return allActions.filter(
        (action) => action.type === "ecommerce" || action.type === "general"
      );
    }
    return allActions;
  };

  const actions = getFilteredActions();

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Card
            key={action.title}
            className="border-border hover:border-primary/50 transition-colors duration-200 bg-card text-card-foreground"
          >
            <CardHeader>
              <div
                className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 ${action.color}`}
              >
                <action.icon size={24} strokeWidth={2} />
              </div>
              <CardTitle className="text-lg text-foreground">
                {action.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {action.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full bg-transparent text-foreground border-border hover:bg-accent hover:text-accent-foreground font-normal"
              >
                {action.cta}
                <ArrowRightIcon className="ml-2" size={16} strokeWidth={2} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
