// src/utils/dateConverter.ts
export const formatDate = (dateStr: string): string => {
  if (dateStr) {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      // year: 'numeric',
      // month: 'long',
      // day: 'numeric',
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  } else {
    return "";
  }
};
export const convertDateTimeString = (_date: string) => {
  const date = new Date(_date);
  // Get the components for local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Combine into the desired format
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const convertSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Number((seconds % 60).toFixed(2));

  let result = "";

  if (hours > 0) {
    result += `${hours}hr `;
  }
  if (minutes > 0) {
    result += `${minutes}mins `;
  }
  if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
    result += `${remainingSeconds}secs`;
  }
  if (result.trim() == "0secs") {
    result = "0";
  }
  return result.trim();
};
