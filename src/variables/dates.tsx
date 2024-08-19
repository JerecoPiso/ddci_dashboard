import Cookies from "js-cookie";
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
  setCookie('_selectedDate', new Date().toString())
  return new Date();
};
export const getSelectedClient = () => {
  if(Cookies.get("_selectedClient")){
    
    return Cookies.get("_selectedClient") || ''
  }else{
    return ''
  }
}
