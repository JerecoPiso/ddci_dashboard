/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

interface Clients {
  name?: string;
  onClientChange: (status: string) => void;
  activeClient:string
}
function ClientSelector({ onClientChange, activeClient }: Clients) {
  const [clients, setClients] = useState<Clients[]>([]);
  const [client, setClient] = useState<string>(activeClient);
  const [open, setOpen] = useState<boolean>(false)
  const handleClient = (_client: string) => {
    onClientChange(_client)
    setClient(_client);
    setOpen(false)
  };
  useEffect(() => {
    setClient(activeClient);
  }, [activeClient]);
  useEffect(() => {
    if (Cookies.get("token") && Cookies.get("_clients")) {
      const __clients = JSON.parse(Cookies.get("_clients") || "");
      const clientsList: Clients[] = [];
      __clients.forEach((el: any) => {
        clientsList.push(el);
      });
      setClients(clientsList.sort());
    }
  
  }, []);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="bg-emerald-600 text-sm font-normal text-white dark:bg-slate-700 py-[10px] px-3 rounded-sm">
          Change / ({client})
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Change Client</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <div className="mt-4">
            <RadioGroup
              value={client}
              onValueChange={(client) => handleClient(client)}
            >
              {clients.map((el: any, index: number) => (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem value={el} id="r2" />
                  <Label htmlFor="r2">{el}</Label>
                </div>
              ))}
            </RadioGroup>
            {/* <Button
              type="submit"
              className="w-full disabled:opacity-60 bg-red-800 hover:bg-red-800 dark:bg-slate-800 text-white mt-4"
            >
              SET
            </Button> */}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ClientSelector;
