"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
// import { CSSProperties } from "react";
import Canvas from "@/components/Canvas";

export default function Preview() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sections, setSections] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedSections = localStorage.getItem("sections");
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateSection = (index: number, props: any) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        props,
      };
      localStorage.setItem("sections", JSON.stringify(newSections));
      return newSections;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to Editor
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "Preview Mode" : "Edit Mode"}
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Canvas
          sections={sections}
          setSections={setSections}
          onUpdateSection={handleUpdateSection}
          isPreview={!isEditing}
        />
      </main>
    </div>
  );
}
