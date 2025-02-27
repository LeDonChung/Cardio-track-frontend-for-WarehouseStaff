import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import React, { useState } from "react";

const categories = [
    { id: 1, full_path_slug: "antibiotics", icon: "💊", level: 1, title: "Antibiotics" },
    { id: 2, full_path_slug: "pain-relief", icon: "🩹", level: 1, title: "Pain Relief" },
    { id: 3, full_path_slug: "vitamins", icon: "🍊", level: 1, title: "Vitamins" },
  ];
  
  const medicines = [
    { id: 1, name: "Amoxicillin", des: "Antibiotic for infections", des_short: "Antibiotic", discount: 10, price: 100, quantity: 50, status: "available", intit: "mg", category: 1 },
    { id: 2, name: "Paracetamol", des: "Pain reliever and fever reducer", des_short: "Pain Relief", discount: 5, price: 50, quantity: 100, status: "low stock", intit: "mg", category: 2 },
    { id: 3, name: "Vitamin C", des: "Boosts immunity", des_short: "Vitamin Supplement", discount: 15, price: 30, quantity: 200, status: "out of stock", intit: "mg", category: 3 },
  ];

export const DivideCategoryPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredMedicines = selectedCategory
      ? medicines.filter((med) => med.category === selectedCategory)
      : medicines;
  return (
    <div className="bg-white text-gray-900">
      <Header />
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medicine Categories</h1>
      <div className="flex gap-4 mb-6">
        <button
          className={`p-2 border rounded-lg ${selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`p-2 border rounded-lg ${selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2">Medicines</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredMedicines.map((med) => (
          <div key={med.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{med.name}</h3>
            <p className="text-gray-600">{med.des_short}</p>
            <p className="text-sm">{med.des}</p>
            <p className="font-semibold">${med.price} <span className="text-red-500">(-{med.discount}%)</span></p>
            <p className="text-sm">Quantity: {med.quantity} {med.intit}</p>
            <p className={
              med.status === "available" ? "text-green-500" : 
              med.status === "low stock" ? "text-yellow-500" : "text-red-500"
            }>{med.status}</p>
          </div>
        ))}
      </div>
    </div>
      <Footer />
    </div>
  );
};
