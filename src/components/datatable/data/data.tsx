import { CheckIcon, PlusCircleIcon } from "lucide-react";
  export const type = [
    {
      value: "BILL_OF_LADING",
      label: "BILL_OF_LADING",
    }
  ]
  
  export const statuses = [
    {
        value: "UPLOADED",
        label: "UPLOADED",
        icon: CheckIcon
      },
      {
        value: "OCRED",
        label: "OCRED",
        icon: CheckIcon
      },
      {
        value: "BILLED",
        label: "BILLED",
        icon: PlusCircleIcon
      },
      
  ]
  
//   export const priorities = [
//     {
//       label: "Low",
//       value: "low",
//       icon: ArrowDownIcon,
//     },
//     {
//       label: "Medium",
//       value: "medium",
//       icon: ArrowRightIcon,
//     },
//     {
//       label: "High",
//       value: "high",
//       icon: ArrowUpIcon,
//     },
//   ]
  