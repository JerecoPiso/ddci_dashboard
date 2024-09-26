/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import apex from "/apex.png";
// import apex from "/apex.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useRef, useState, useContext } from "react";
import { setCookie } from "@/utils/dates";

import { User } from "@/variables/user";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { BaseUrlContext } from "@/App";
import { useNavigate } from "react-router-dom";
import { TriangleAlert, Eye, EyeOff } from "lucide-react";
function Login() {
  const baseUrl = useContext(BaseUrlContext);
  const navigate = useNavigate();
  const hasLoad = useRef(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);


  
  const [islogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    // username: "dashboard",
    // password: "Aa@123!",
    username: "",
    password: "",
  });
  const [theme] = useState<string | null>(
    localStorage.getItem("vite-ui-theme")
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLogin(true);
    try {
      const response = await axios.post(`${baseUrl}credential/login`, user);
      if (response.status == 200) {
        setCookie("token", response.data.details.token);
        setCookie("_clients", JSON.stringify(response.data.details.clients));
        setCookie(
          "_authorities",
          JSON.stringify(response.data.details.authorities)
        );
        navigate("/");
      }
      setIsLogin(false);
    } catch (err: any) {
      toast("Error!", {
        style: { color: "red", backgroundColor: "#ffeae4" },
        className: "my-classname",
        description: "Please check your credentials / or the connection",
        duration: 3000,
        icon: <TriangleAlert className="w-5 h-5" />,
        closeButton: false,
      });
      setIsLogin(false);
    }
  };
  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/bolmanagement");
    }
    hasLoad.current = true;
  });
  return (
    <div className="flex justify-center items-center w-full border h-[100vh]">
      <form onSubmit={login} className="md:w-[25em] w-[80%] p-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl -mt-20">
              <img
                // src={theme === "dark" ? ddc_connect3 : ddc_connect}
                src={theme === "dark" ? apex : apex}
                alt=""
                className="h-20 mt-4 w-full rounded-md "
              />
            </CardTitle>
            <CardDescription className="text-center">
            Advanced Platform for Enhanced Extraction
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center">
                <Input
                  id="password"
                  type={!showPassword ? "password" : "text"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                  className="border-r pr-10"
                />
                {!showPassword ? (
                  <Eye className="-ml-8" onClick={() => handleShowPassword()} />
                ) : (
                  <EyeOff
                    className="-ml-8"
                    onClick={() => handleShowPassword()}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full disabled:opacity-60 bg-red-800 hover:bg-red-800 dark:bg-slate-800 text-white"
              disabled={islogin}
            >
              {!islogin ? "Login" : <Loading size={15} />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
export default Login;
