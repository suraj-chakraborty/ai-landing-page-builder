export const parsePromptToSections = (prompt: string) => {
    const sections = [];
    console.log("Parsing Prompt:", prompt);
    if (prompt.includes("hero section")) {
      sections.push({
        id: `section-${Date.now()}`, // Unique ID for each section
        type: "Hero",
        library: "Tailwind", // Default library for Hero Section
        props: {
          title: "Welcome to My Page",
          subtitle: "Build your dream landing page!",
          image: "/images/hero.jpg",
        },
        customCSS: {}, // Initial empty custom CSS object
        children: [],
      });
    }
  
    if (prompt.includes("features section")) {
      sections.push({
        id: `section-${Date.now()}`,
        type: "Features",
        library: "Antd", // Default library for Features Section
        props: {
          features: [
            {
              title: "Feature 1",
              description: "Highlight your unique offerings.",
            },
            {
              title: "Feature 2",
              description: "Customizable and responsive.",
            },
            {
              title: "Feature 3",
              description: "Fast and efficient development.",
            },
          ],
        },
        customCSS: {}, // Initial empty custom CSS object
        children: [],
      });
    }
  
    if (prompt.includes("footer section")) {
      sections.push({
        id: `section-${Date.now()}`,
        type: "Footer",
        library: "Antd", // Default library for Footer Section
        props: {    //Default props data 
          text: "© 2025 My Landing Page. All rights reserved.",
          pp: "Privacy Policy",
          tos: "Terms of Service",
          cu: "Contact Us",
        },
        customCSS: {}, // Initial empty custom CSS object
        children: [],
      });
    }
    // console.log("Sections Parsed:", sections); // Debugging line
    return sections;
  };
  