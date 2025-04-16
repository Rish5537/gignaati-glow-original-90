
export function extractVariablesFromTemplate(body: string): string[] {
  const regex = /\{\{([^{}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(body)) !== null) {
    variables.push(match[1].trim());
  }
  
  return [...new Set(variables)]; // Remove duplicates
}
