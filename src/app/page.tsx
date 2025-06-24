"use client";

import { useState, useEffect } from "react";
import Canvas from "@/components/Canvas";
import { COMPONENTS } from "@/components/ComponentRegistry";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Sidebar from "@/components/Sidebar";
import { parsePromptToSections } from "@/utils/parsePromptToSections";
import { useTheme } from "next-themes";

interface Section {
  id: string;
  type: string;
  library: string;
  props: unknown;
  children: Section[];
  customChildCSS?: Record<number, React.CSSProperties>;
  childClassNames?: Record<string, string>;
}

interface Component {
  type: keyof typeof COMPONENTS;
  library: 'Chakra' | 'Mui' | 'Antd' | 'Tailwind';
  label: string;
}

// Add a function to generate unique IDs
const generateUniqueId = () => {
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generatePageComponent = (sections: Section[]) => {
  return `
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { COMPONENTS } from '@/components/ComponentRegistry';

interface Section {
  id: string;
  type: string;
  library: string;
  props: any;
  children: Section[];
  customChildCSS?: Record<number, CSSProperties>;
  childClassNames?: Record<string, string>;
}

const RenderComponent = ({
  component,
  customCSS,
  className
}: {
  component: Section;
  customCSS?: CSSProperties;
  className?: string;
}) => {
  const Component = COMPONENTS[component.type]?.[component.library];

  if (!Component) {
    console.error(\`Component not found for type '\${component.type}' and library '\${component.library}'\`);
    return null;
  }

  return (
    <div className="relative">
      <div className={\`w-full \${className || ''}\`} style={customCSS}>
        <Component {...component.props} />
        
        {component.children && component.children.length > 0 && (
          <div className="mt-4 flex flex-col gap-6">
            {component.children.map((child, index) => (
              <RenderComponent
                key={\`\${component.id}-child-\${index}\`}
                component={child}
                customCSS={component.customChildCSS?.[index]}
                className={component.childClassNames?.[index]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sections: Section[] = ${JSON.stringify(sections, null, 2)};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <main className="container mx-auto py-6 px-6">
        <div className="flex flex-col gap-6">
          {sections.map((section, index) => (
            <RenderComponent
              key={section.id}
              component={section}
            />
          ))}
        </div>
      </main>
    </div>
  );
}`;
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [prompt, setPrompt] = useState("");
  // const [isFullPage, setIsFullPage] = useState(false);
  const router = useRouter();

 useEffect(() => {
  setMounted(true);
  const savedSections = localStorage.getItem("sections");
  if (savedSections) {
    const parsedSections = JSON.parse(savedSections);
    setSections(parsedSections);
  }
}, []);

useEffect(() => {
  if (sections.length > 0) {
    localStorage.setItem("sections", JSON.stringify(sections));
  }
}, [sections]);



  if (!mounted) {
    return null;
  }

  const handleComponentClick = (component: Component) => {
    setSections((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        type: component.type,
        library: component.library,
        props: {},
        children: [],
      },
    ]);
  };

  const onUpdateSection = (index: number, props: unknown) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, props } : s
      )
    );
  };

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      setSections([]);
      localStorage.removeItem("sections");
    }
  };

  const openFullPagePreview = () => {
    const previewData = {
      sections,
      theme
    };
    localStorage.setItem("previewData", JSON.stringify(previewData));
    router.push("/preview");
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSections = parsePromptToSections(prompt);
    setSections((prev: Section[]) => [...prev, ...parsedSections]);
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    // Create package.json
    const packageJson = {
      name: "generated-landing-page",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        export: "next export"
      },
      dependencies: {
        "next": "latest",
        "react": "latest",
        "react-dom": "latest",
        "@chakra-ui/react": "latest",
        "@emotion/react": "latest",
        "@emotion/styled": "latest",
        "@mui/material": "latest",
        "@mui/icons-material": "latest",
        "antd": "latest",
        "tailwindcss": "latest",
        "postcss": "latest",
        "autoprefixer": "latest",
        "next-themes": "latest"
      }
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // Create next.config.js
    const nextConfig = `
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  }
}`;
    zip.file("next.config.js", nextConfig);

    // Create tailwind.config.js
    const tailwindConfig = `
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
    zip.file("tailwind.config.js", tailwindConfig);

    // Create postcss.config.js
    const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
    zip.file("postcss.config.js", postcssConfig);

    // Create src/app/layout.tsx
    const layoutTsx = `
import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Generated Landing Page',
  description: 'Generated using AI Landing Page Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`;
    zip.file("src/app/layout.tsx", layoutTsx);

    // Create src/app/globals.css
    const globalsCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}`;
    zip.file("src/app/globals.css", globalsCss);

    // Create src/app/page.tsx with the exact same layout
    const pageTsx = generatePageComponent(sections);
    zip.file("src/app/page.tsx", pageTsx);

    // Create components
    sections.forEach((section, index) => {
      const componentCode = `
import React from 'react';

const ${section.type}${index} = () => {
  return (
    <div>
      ${JSON.stringify(section.props, null, 2)}
    </div>
  );
};

export default ${section.type}${index};`;
      zip.file(`src/components/${section.type}${index}.tsx`, componentCode);
    });

    // Create README.md
    const readme = `# Generated Landing Page

This project was created using the AI Landing Page Builder.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

4. Export as static website:
\`\`\`bash
npm run export
\`\`\`

The static website will be generated in the \`out\` directory.`;
    zip.file("README.md", readme);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "landing-page.zip");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 dark:bg-white-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors pt-2"
        >
          {theme === 'dark' ? "🌞" : "🌙"}
        </button>
      </div>
      <Sidebar onComponentClick={handleComponentClick} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <button
                onClick={handleClearCanvas}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Clear Canvas
              </button>
              <button
                onClick={openFullPagePreview}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Preview Full Page
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download Project
              </button>
            </div>
          </div>
          <form onSubmit={handlePromptSubmit} className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="e.g., 'Create a hero section, features section, and footer section'"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Section
            </button>
          </form>
        </div>
        <Canvas
          sections={sections}
          setSections={setSections}
          onUpdateSection={onUpdateSection}
        />
      </div>
    </div>
  );
}
