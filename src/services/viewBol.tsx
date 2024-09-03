import axios from "axios";
import Cookies from "js-cookie";
// const headers = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${Cookies.get("token")}`,
//     },
//     responseType: "blob",
//   };
export const getImage = async (
  baseurl: string,
  document: string,
  clientName: string,
  page?: number
) => {
  const response = await axios.get(
    `${baseurl}document/get-image/${clientName}/${document}/${page}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      responseType: "blob",
    }
  );
  const blob = new Blob([response.data], { type: "jpg" });
  const url = URL.createObjectURL(blob);
  console.log(url);
  return url;
};
export const getOcrVerifiedData = async (
  baseurl: string,
  type: string,
  document: string,
  clientName: string,
 
) => {
  const response = await axios.get(`${baseurl}document/${type}/${clientName}/${document}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  return response.data;
};
