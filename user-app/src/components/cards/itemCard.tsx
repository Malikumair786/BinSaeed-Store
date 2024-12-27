import Image, { StaticImageData } from "next/image";
import React from "react";
import Cake1 from "../../assets/cake_2.png";

interface CardProps {
  imagePath: string | StaticImageData;
  itemName: string;
  itemPrice: number;
  shortDesc: string;
  onAddToCart?: () => void; // Optional prop for handling add to cart
}

const ItemCard: React.FC<CardProps> = ({
  imagePath,
  itemName,
  itemPrice,
  shortDesc,
  onAddToCart,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden border">
      <Image
        priority
        src={imagePath}
        // fill
        alt={itemName}
        className="object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{itemName}</h2>
        <p className="text-gray-600 mt-2">{shortDesc}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-gray-800">
            Rs. {itemPrice}
          </span>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
