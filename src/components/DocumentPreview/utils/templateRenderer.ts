/**
 * Renders EJS-style templates with variable substitution
 */
export function renderTemplate(
  templateContent: string,
  variables: Record<string, any> = {}
): string {
  let rendered = templateContent;

  // Replace <%= variable %> patterns
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`<%=\\s*${key}\\s*%>`, "g");
    rendered = rendered.replace(regex, String(value || ""));
  });

  // Handle conditional blocks like <% if (customMessage) { %>...content...<% } %>
  rendered = rendered.replace(
    /<% if \((\w+)\) \{ %>([\s\S]*?)<% } %>/g,
    (match, varName, content) => {
      const value = variables[varName];
      return value && String(value).trim() ? content : "";
    }
  );

  // Handle conditional blocks with negation like <% if (!variable) { %>
  rendered = rendered.replace(
    /<% if \(!(\w+)\) \{ %>([\s\S]*?)<% } %>/g,
    (match, varName, content) => {
      const value = variables[varName];
      return !value || !String(value).trim() ? content : "";
    }
  );

  // Handle else blocks <% } else { %>
  rendered = rendered.replace(
    /<% } else \{ %>([\s\S]*?)<% } %>/g,
    (match, content) => content
  );

  return rendered;
}

/**
 * Generates a complete email preview by combining content with layout
 */
export function generateEmailPreview(
  templateData: {
    htmlContent: string;
    layout: { htmlLayout: string };
  },
  variables: Record<string, any> = {}
): string {
  // First render the content with variables
  const renderedContent = renderTemplate(templateData.htmlContent, variables);

  // Then render the layout with the content and additional layout variables
  const layoutVariables = {
    ...variables,
    content: renderedContent,
    appName: "Property Management System",
    year: new Date().getFullYear(),
  };

  return renderTemplate(templateData.layout.htmlLayout, layoutVariables);
}

/**
 * Validates that all required variables are provided
 */
export function validateRequiredVariables(
  requiredVariables: string[],
  providedVariables: Record<string, any>
): { isValid: boolean; missingVariables: string[] } {
  const missingVariables = requiredVariables.filter(
    (varName) => !providedVariables[varName]
  );

  return {
    isValid: missingVariables.length === 0,
    missingVariables,
  };
}
