import React from "react";
import { Button } from "./ui/button";
import { CircleCheckBig, Settings } from "lucide-react";
import NotificationCard from "./NotificationCard";

interface Notifications {
  title: string;
  details: string;
  date: string;
  status: "read" | "unread";
  isPending: boolean;
}

const notifications: Notifications[] = [
  {
    title: "New Order Recieved",
    details: "Tech Accessories Store received a new order worth $245",
    date: "2024-01-10T00:00:00Z",
    status: "unread",
    isPending: false,
  },
  {
    title: "Review Pending",
    details: "DownTown Coffee Shop has 3 new reviews to respond to",
    date: "2024-01-10T00:00:00Z",
    status: "unread",
    isPending: true,
  },
  {
    title: "Inventory Alert",
    details: "Fashion Boutique Online has 5 items low in stock",
    date: "2024-01-09T00:00:00Z",
    status: "read",
    isPending: false,
  },
  {
    title: "Inventory Alert",
    details: "Fashion Boutique Online has 5 items low in stock",
    date: "2024-01-09T00:00:00Z",
    status: "read",
    isPending: false,
  },
];

const groupNotification = (notifications: Notifications[]) => {
  const groups: Record<string, Notifications[]> = {};

  for (const notification of notifications) {
    if (notification.status === "unread") {
      if (!groups.unread) groups.unread = [];
      groups.unread.push(notification);
    }

    if (notification.status !== "unread") {
      if (!groups.earlier) groups.earlier = [];
      groups.earlier.push(notification);
    }
  }

  return groups;
};

const Notifications = () => {
  const grouped = groupNotification(notifications);
  return (
    <>
      <header>
        <h2 className=" text-xl md:text-3xl">Notifications</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm md:text-xl text-black/50">
            Stay updated with your stores and tasks
          </p>
          <Button
            variant={"outline"}
            className="hover:cursor-pointer hidden md:flex items-center "
          >
            <Settings />
            Settings
          </Button>
        </div>
        <article className="flex justify-between items-center bg-[#E6EBFA] border-2 p-4 rounded-2xl mt-4 border-[#C4D1FA]">
          <p className="font-bold text-sm">You have two unread notifications</p>
          <Button className="hover:cursor-pointer hidden md:block hover:scale-105 transition-all duration-700">
            Mark all as read
          </Button>
          <Button className="md:hidden">
            <CircleCheckBig />
          </Button>
        </article>
      </header>
      <section className="space-y-6">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="space-y-4">
            <h3>{group.replace(group[0], group[0].toUpperCase())}</h3>
            {items.map((n, i) => (
              <NotificationCard {...n} key={i} index={i} />
            ))}
          </div>
        ))}
      </section>
    </>
  );
};

export default Notifications;
