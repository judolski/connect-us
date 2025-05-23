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

export function formatDateTime2(input: string | Date): string {
  const date = new Date(input);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const dateNow = new Date();
  const dayNow = dateNow.getDate();
  const monthNow = dateNow
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const yearNow = dateNow.getFullYear();

  const isSameDay = (): boolean => {
    return year === yearNow && month === monthNow && day === dayNow;
  };

  const isYesterday = (): boolean => {
    return year === yearNow && month === monthNow && day === dayNow - 1;
  };

  if (isSameDay()) {
    return `${hours}:${minutes}${ampm}`;
  }

  if (isYesterday()) {
    return `Yesterday`;
  }

  return `${day} ${month}, ${year}`;
}
