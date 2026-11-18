export function obterApiUrl() {
  const apiUrl = process.env.PORTAL_API_URL;

  if (!apiUrl) {
    throw new Error("A variável PORTAL_API_URL não foi configurada.");
  }

  return apiUrl.replace(/\/$/, "");
}
