import { DollarSign, MapPinCheckInside, Store } from "lucide-react";
import React from "react";
import WrapContent from "./WrapContent";

const Overview = () => {
  const features = [
    {
      title: "Create Store",
      desc: "Create and manage your own online store with ease. List products, set prices, and start selling to customers in your area.",
      Icon: <Store />,
    },
    {
      title: "Buy from nearby vendors",
      desc: "Find and purchase products from local vendors in your neighborhood. Support small businesses while enjoying convenient local shopping.",
      Icon: <MapPinCheckInside />,
    },
    {
      title: "Crypto payments",
      desc: "Pay securely using popular cryptocurrencies. Fast, borderless transactions with low fees for both buyers and sellers.",
      Icon: <DollarSign />,
    },
  ];

  return (
    <div className="py-20">
      <WrapContent>
        <div className="grid grid-cols-1 pb-10 md:grid-cols-2">
          <div>
            <div>
              <h2 className="text-3xl md:text-4xl">Features</h2>
              <small>
                Discover our platform&apos;s key features designed to
                revolutionize local commerce. Create your own digital
                storefront, shop from nearby vendors, and enjoy secure
                cryptocurrency payments - all in one seamless experience.
              </small>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-1 rounded-lg text-white lg:grid-cols-3 md:grid-cols-3 bg-black">
          {features.map((feature, i) => {
            return (
              <div
                className={`${
                  i === 1
                    ? "border-t md:border-t-0  border-b md:border-b-0 md:border-l md:border-r border-dotted border-t-gray-400 border-l-gray-400 border-r-gray-400"
                    : ""
                }  flex flex-col items-center justify-center gap-5 py-20 px-5`}
                key={feature.title}
              >
                <span className="text-7xl">{feature.Icon}</span>
                <h3 className="text-2xl text-center">{feature.title}</h3>
                <p className="text-center">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </WrapContent>
    </div>
  );
};

export default Overview;
