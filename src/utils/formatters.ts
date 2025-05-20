export function formatDateTime(input: string | Date): string {
  const date = new Date(input);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase(); // 'MAY'
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes}${ampm}`;
}
