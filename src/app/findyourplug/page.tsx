"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FindYourPlugPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-4">
      <Link href={"/findyourplug/login"}>
        <Button variant={"outline"}>Login</Button>
      </Link>
      <Link href="/findyourplug/register">
        <Button variant={"outline"}>Register</Button>
      </Link>
    </div>
  );
};

export default FindYourPlugPage;
