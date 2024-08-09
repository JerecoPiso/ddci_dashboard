/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import ddc_connect from "../../../public/new.png";
import ddc_connect3 from "../../../public/ddc_connect3.png";
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
import React, { useEffect, useRef, useState } from "react";
import { User } from "@/variables/user";
import axios from "axios";
import Loading from "@/components/loading";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const hasLoad = useRef(false);
  const [islogin, setIsLogin] = useState<boolean>(false);

  const [user, setUser] = useState<User>({
    username: "dashboard",
    password: "Aa@123!",
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
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLogin(true);
    try {
      const response = await axios.post(
        "http://192.168.23.84:8007/ddcic/api/v1/credential/login",
        user
      );
      if (response.status == 200) {
        console.log(response.data.details)
        const currentDate = new Date();
        const expirationDate = new Date(
          currentDate.getTime() + 1 * 60 * 60 * 1000
        );
        Cookies.set("token", response.data.details.token, {
          path: "/",
          expires: expirationDate,
        });
        Cookies.set("_clients", JSON.stringify(response.data.details.clients), {
          path: "/",
          expires: expirationDate,
        });
        navigate("/dashboard/bolmanagement");
      }
      setIsLogin(false);

    } catch (err: any) {
      alert(err.response.data.message);
      setIsLogin(false);
    }
  };
  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/dashboard/bolmanagement");
    }
    hasLoad.current = true;
  });
  return (
    <div className="flex justify-center items-center w-full border h-[100vh]">
      <form onSubmit={login} className="md:w-[25em] w-full p-2">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              <img
                src={theme === "dark" ? ddc_connect3 : ddc_connect}
                alt=""
                className="h-16 w-full -mt-4"
              />
              Login
            </CardTitle>
            <CardDescription>
              Enter your username below to login to your account.
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
              <Input
                id="password"
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
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
