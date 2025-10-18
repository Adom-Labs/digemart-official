import React from "react";
import { Button } from "./ui/button";
import { CircleCheckBig, Settings } from "lucide-react";
import NotificationCard from "./NotificationCard";

const notifications = [
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
];

const Notifications = () => {
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
          <Button className="hover:cursor-pointer hidden md:block">
            Mark all as read
          </Button>
          <Button className="md:hidden">
            <CircleCheckBig />
          </Button>
        </article>
      </header>
      <section className="space-y-6">
        {notifications.map((item, index) => (
          <div key={index}>
            <NotificationCard {...item} key={index} />
          </div>
        ))}
      </section>
    </>
  );
};

export default Notifications;
