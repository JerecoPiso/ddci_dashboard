import Cookies from "js-cookie";
export const formatDate = (dateStr: string): string => {
  if (dateStr) {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
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

export const getProdDate = (date: Date | undefined) => {
  // console.log(date)
  const _current_date = new Date();
  const _prod_date =
    date === undefined
      ? `${_current_date.getFullYear()}-${
          _current_date.getMonth() < 9
            ? "0" + Number(_current_date.getMonth() + 1)
            : Number(_current_date.getMonth() + 1)
        }-${
          _current_date.getDate() < 10
            ? "0" + _current_date.getDate()
            : _current_date.getDate()
        }`
      : `${date.getFullYear()}-${
          date.getMonth() < 9
            ? "0" + Number(date.getMonth() + 1)
            : Number(date.getMonth() + 1)
        }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

  // // const _prod_date = date === undefined ? `${_current_date.getFullYear()}-${_current_date.getMonth() < 9 ? '0'+Number(_current_date.getMonth()+1) : Number(_current_date.getMonth()+1)}-${_current_date.getDate() < 10 ? '0'+Number(_current_date.getDate()-1) : Number(_current_date.getDate()-1)}` :
  // // `${date.getFullYear()}-${date.getMonth() < 9 ? '0'+Number(date.getMonth()+1) : Number(date.getMonth()+1)}-${date.getDate() < 10 ? '0'+date.getDate() : date.getDate()}`
  return _prod_date;
  // return "2024-08-10";
};
export const getPreviousDate = (_date: string) => {
  const date = new Date(_date);
  // Subtract one day
  date.setDate(date.getDate() - 1);
  // Format the date to YYYY-MM-DD
  return date.toISOString().split("T")[0];
};
export const getSelectedDate = () => {
  if (Cookies.get("_selectedDate")) {
    const dateString = Cookies.get("_selectedDate");
    if (dateString) {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }
  setCookie("_selectedDate", new Date().toString());
  return new Date();
};
export const getSelectedClient = () => {
  if (Cookies.get("_selectedClient")) {
    return Cookies.get("_selectedClient") || "";
  } else {
    return "";
  }
};

export const setCookie = (_name: string, _value: string) => {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
  Cookies.set(_name, _value, {
    path: "/",
    expires: expirationDate,
    secure: false,
    sameSite: "lax",
  });
};
