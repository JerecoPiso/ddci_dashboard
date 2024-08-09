export const getProdDate = (date: Date | undefined) => {
    console.log(date)
//   const _current_date = new Date();
//   const _prod_date =
//     date === undefined
//       ? `${_current_date.getFullYear()}-${
//           _current_date.getMonth() < 9
//             ? "0" + Number(_current_date.getMonth() + 1)
//             : Number(_current_date.getMonth() + 1)
//         }-${
//           _current_date.getDate() < 10
//             ? "0" + _current_date.getDate()
//             : _current_date.getDate()
//         }`
//       : `${date.getFullYear()}-${
//           date.getMonth() < 9
//             ? "0" + Number(date.getMonth() + 1)
//             : Number(date.getMonth() + 1)
//         }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

  // const _prod_date = date === undefined ? `${_current_date.getFullYear()}-${_current_date.getMonth() < 9 ? '0'+Number(_current_date.getMonth()+1) : Number(_current_date.getMonth()+1)}-${_current_date.getDate() < 10 ? '0'+Number(_current_date.getDate()-1) : Number(_current_date.getDate()-1)}` :
  // `${date.getFullYear()}-${date.getMonth() < 9 ? '0'+Number(date.getMonth()+1) : Number(date.getMonth()+1)}-${date.getDate() < 10 ? '0'+date.getDate() : date.getDate()}`
  // return _prod_date
  return "2024-08-06";
};

