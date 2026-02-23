import Template from "../models/template.model.js";

export const renderTemplate = async (templateName, data) => {
  const template = await Template.findOne({ name: templateName });

  if (!template) throw new Error("Template not found");

  let subject = template.subject;
  let body = template.body;

  for (const variable of template.variables) {
    const value = data[variable] || "";

    const regex = new RegExp(`{{${variable}}}`, "g");

    subject = subject.replace(regex, value);
    body = body.replace(regex, value);
  }

  return { subject, body };
};
