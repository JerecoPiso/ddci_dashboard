/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
export const downloadReport = (
  baseurl: string,
  client: string,
  prod_date: string,
  report_name: string,
  onDownloadProgress: (progressEvent: any) => void,
  onError: (error: any) => void // Add an onError callback
  
  // setIsDownloading: (condition: boolean) => void
) => {
  axios
    .get(`${baseurl}document/download/${report_name}/${client}/${prod_date}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      responseType: "arraybuffer",
      onDownloadProgress: onDownloadProgress,
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${report_name.toUpperCase()}_${client}_${prod_date}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading the file", error);
      onError(error); // Trigger the onError callback if an error occurs
    });
};
