import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { User } from "@/variables/user";
import axios from "axios";
function Login() {
  const [user, setUser] = useState<User>({username: '', password: ''});
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // http://localhost:8006/ddcic/api/status/server-time
    const response = await axios.post('http://192.168.220.136:8007/ddcic/api/status/server-time',  {
   
       // withCredentials: true, // Allow credentials
      })
    console.log(response.data)
  };
  return (
    <div className="flex justify-center items-center w-full border h-[100vh]">
      <form onSubmit={login} className="md:w-[25em] w-full p-2">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" name="username" value={user.username} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" value={user.password} onChange={handleChange} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Login;
