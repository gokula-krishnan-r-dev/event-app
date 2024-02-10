"use client";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategoryTag = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);
  const onSelectCategory = (category: string) => {
    let newUrl = "";
    setActiveCategory(category);
    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-6">
      {categories.map((category: any) => (
        <button
          onClick={() => onSelectCategory(category.name)}
          className={`${
            activeCategory === category.name ? "bg-white" : "bg-gray-50"
          }  border duration-300 hover:bg-white hover:border  px-6 py-3 rounded-full font-semibold text-grey-800`}
        >
          <h4>{category.name}</h4>
        </button>
      ))}
    </div>
  );
};

export default CategoryTag;
