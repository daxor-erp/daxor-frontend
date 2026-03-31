const fs = require('fs');
const path = require('path');

// Fix the generated graphql.ts file
const filePath = path.join(__dirname, '../gql/graphql.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add defaultOptions after imports if missing
if (!content.includes('const defaultOptions')) {
  content = content.replace(
    /(import \* as Apollo from '@apollo\/client';\n)/,
    `$1const defaultOptions = {} as const;\n`
  );
} else {
  // Remove duplicate defaultOptions if exists
  const lines = content.split('\n');
  let foundFirst = false;
  content = lines.filter(line => {
    if (line.includes('const defaultOptions')) {
      if (!foundFirst) {
        foundFirst = true;
        return true;
      }
      return false;
    }
    return true;
  }).join('\n');
}

// 2. Remove duplicate/orphaned type definitions
// This regex finds orphaned fields after a closing brace
content = content.replace(
  /};\n([a-z][a-zA-Z]*Id: Scalars\['String'\]\['input'\];\n\s+status\?: InputMaybe<Scalars\['String'\]\['input'\]>;\n};)/g,
  '};'
);

// 3. Fix any malformed type names (like "anizationId" instead of "organizationId")
content = content.replace(/\banizationId:/g, 'organizationId:');

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed gql/graphql.ts');
