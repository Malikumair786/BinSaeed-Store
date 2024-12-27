<<<<<<< Updated upstream
import Link from "next/link";
import React from "react";

const App = () => {
  return (
    <>
      <div>
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
      <div>
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </>
  );
};

export default App;
=======
"use client";
import React, { useEffect, useState } from "react";
import FloatingNav from "@/components/ui/floating-navbar";
import { User } from "lucide-react";
import BinSaeedLogo from "../icons/Bin_Saeed_logo.png";
import Image from "next/image";
import Link from "next/link";
import Cake1 from "../assets/cake_1.png";
import Cake2 from "../assets/cake_2.png";
import ItemCard from "@/components/cards/itemCard";

const items = [
  {
    id: 1,
    imagePath: Cake1,
    itemName: "Chocolate Cake",
    itemPrice: 500,
    shortDesc: "Delicious and soft cake made from khoya.",
  },
  {
    id: 2,
    imagePath: Cake2,
    itemName: "Chocolate Cake",
    itemPrice: 500,
    shortDesc: "Delicious and soft cake made from khoya.",
  },
  {
    id: 3,
    imagePath: Cake1,
    itemName: "Chocolate Cake",
    itemPrice: 500,
    shortDesc: "Delicious and soft cake made from khoya.",
  },
  {
    id: 4,
    imagePath: Cake2,
    itemName: "Chocolate Cake",
    itemPrice: 500,
    shortDesc: "Delicious and soft cake made from khoya.",
  },
];

const menuItems = [
  { name: "Bakers", id: "bakers" },
  { name: "Cakes", id: "cakes" },
  { name: "Sweets", id: "sweets" },
  { name: "Biscuits", id: "biscuits" },
  { name: "General Items", id: "general-items" },
  { name: "Dairy", id: "dairy" },
];

const navItems = [
  {
    name: "Bin Saeed",
    link: "/",
    icon: (
      <Image
        priority
        src={BinSaeedLogo}
        alt="App logo"
        className="w-20 h-full object-cover"
      />
    ),
  },
  {
    name: "Login",
    link: "/login",
    icon: <User color="brown" size={32} className="w-16" />,
  },
];

export default function App() {
  const [selectedItem, setSelectedItem] = useState<string | null>(
    menuItems[0].id
  );
  const handleAddToCart = (itemName: string) => {
    alert(`${itemName} added to cart!`);
  };
  useEffect(() => {
    const sections = menuItems.map((item) => document.getElementById(item.id));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSelectedItem(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });
    return () => {
      sections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, [menuItems]);

  return (
    <div className="w-full">
      <FloatingNav navItems={navItems} />
      <div className="flex overflow-x-auto space-x-4 p-4 bg-background scrollbar-none sticky top-0">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item.id)}
            className="relative"
          >
            <Link
              href={`#${item.id}`}
              scroll={true}
              className={`px-4 py-2 bg-card rounded-lg shadow-xl text-foreground hover:bg-background whitespace-nowrap ${
                selectedItem === item.id ? "text-primary" : "text-foreground"
              }`}
            >
              {item.name}
            </Link>

            {selectedItem === item.id && (
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-primary"
                style={{ width: "40%", height: "2px" }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        key="cakes"
        id="cakes"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            imagePath={item.imagePath}
            itemName={item.itemName}
            itemPrice={item.itemPrice}
            shortDesc={item.shortDesc}
            onAddToCart={() => handleAddToCart(item.itemName)}
          />
        ))}
      </div>

      {menuItems.map((item) => (
        <div key={item.id} id={item.id} className="space-y-8 p-4 pt-5">
          <section className="h-screen bg-background text-foreground border border-gray-200 rounded-lg p-4">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="mt-2 text-gray-600">
              Content for the {item.name} section goes here.
            </p>
          </section>
        </div>
      ))}
    </div>
  );
}
>>>>>>> Stashed changes
