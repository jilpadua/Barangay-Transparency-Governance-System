export function formDataToObject(
  formData: FormData,
  checkboxFields: string[] = [],
) {
  const obj = Object.fromEntries(formData.entries()) as Record<string, unknown>;
  for (const field of checkboxFields) {
    if (!(field in obj)) {
      obj[field] = "false";
    }
  }
  return obj;
}

export function metadataFromForm(
  formData: FormData,
  checkboxFields: string[] = [],
) {
  const obj = formDataToObject(formData, checkboxFields);
  delete obj.file;
  return obj;
}
