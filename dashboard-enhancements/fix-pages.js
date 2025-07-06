// fix-pages.js
const fs = require("fs");
const path = require("path");

function processPageFile(filePath) {
  console.log(`Processing: ${filePath}`);

  // Read the file content
  let content = fs.readFileSync(filePath, "utf8");

  // Remove BOM if present
  content = content.replace(/^\uFEFF/, "");

  // Check if it's already a simple page that imports a component
  if (
    content.includes("export default function") &&
    content.includes("return <") &&
    !content.includes("useState") &&
    !content.includes("useEffect")
  ) {
    console.log(`  Already simple, skipping`);
    return;
  }

  // Extract the directory and create component name
  const dir = path.dirname(filePath);
  const relativePath = dir.split("/app/")[1] || "";
  const componentName =
    relativePath
      .split("/")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Page";

  // Create components directory if it doesn't exist
  const componentsDir = path.join(
    process.cwd(),
    "src/components/pages",
    relativePath,
  );
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Create component file
  const componentPath = path.join(componentsDir, `${componentName}.tsx`);

  // Ensure 'use client' directive is at the top
  if (!content.startsWith("'use client'")) {
    content = "'use client';\n\n" + content;
  }

  // Write the component file
  fs.writeFileSync(componentPath, content);
  console.log(`  Created component: ${componentPath}`);

  // Create simplified page file
  const newPageContent = `import ${componentName} from '@/components/pages/${relativePath}/${componentName}';\n\nexport default function Page() {\n  return <${componentName} />;\n}\n`;
  fs.writeFileSync(filePath, newPageContent);
  console.log(`  Updated page: ${filePath}`);
}

function findPageFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      findPageFiles(fullPath);
    } else if (entry.name === "page.tsx") {
      processPageFile(fullPath);
    }
  }
}

// Start processing from the app directory
findPageFiles(path.join(process.cwd(), "src/app"));
console.log("All page files processed!");
