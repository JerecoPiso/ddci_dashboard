/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useRef, ChangeEvent, useContext } from "react";
import { DataTable } from "@/components/datatable/usermanagement/data-table";
import { columns } from "@/components/datatable/usermanagement/columns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TriangleAlert, CheckCircleIcon, Eye, EyeOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import Cookies from "js-cookie";
import { BaseUrlContext } from "@/App";

interface Users {
  id?: number;
  lastname: string;
  firstname: string;
  contactNumber: string;
  emailAddress: string;
  username: string;
  password: string;
  middlename?: string;
  suffix?: string;
  client: string;
  authorities: string;
}
function UserManagement() {
  const baseUrl = useContext(BaseUrlContext);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const hasFetchedData = useRef(false);
  const roles = [
    "ROLE_ADMIN",
    "ROLE_VERIFIER",
    "ROLE_DASHBOARD",
    "ROLE_CLIENT",
    "ROLE_DOCUMENT",
    "ROLE_SYSTEM",
    // "ROLE_QC",
  ];
  const [openAddModal, setOpenAddModal] = useState(false);
  const [archive, setArchive] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [clients, setClients] = useState<[]>([]);
  const [userinfo, setUserinfo] = useState<Users>({
    id: 0,
    username: "",
    lastname: "",
    firstname: "",
    contactNumber: "",
    emailAddress: "",
    password: "",
    client: "",
    authorities: "",
  });
  const getUsers = async () => {
    hasFetchedData.current = true;
    const response = await axios.get(`${baseUrl}credential/list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    if (response.status === 200) {
      const _users: Users[] = [];
      console.log(response.data.details);
      response.data.details.forEach(
        (el: {
          id: any;
          username: any;
          lastname: any;
          firstname: any;
          contactNumber: any;
          emailAddress: any;
          password: any;
          clients: any;
          athorities: any;
        }) => {
          _users.push({
            id: el.id,
            username: el.username,
            lastname: el.lastname,
            firstname: el.firstname,
            contactNumber: el.contactNumber,
            emailAddress: el.emailAddress,
            password: el.password,
            client: el.clients.toString(),
            authorities: el.athorities.toString(),
          });
        }
      );
      setUsers(_users);
    }
  };
  const getClients = async () => {
    hasFetchedData.current = true;
    const response = await axios.get(`${baseUrl}client/get-active`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    if (response.status === 200) {
      setClients(response.data.details);
    }
  };
  const deleteUser = async () => {
    hasFetchedData.current = true;
    // alert(userinfo.username);
    try {
      const response = await axios.post(
        `${baseUrl}credential/archive/${userinfo.id}/${userinfo.username}`,
        [],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        ToastSuccess(response.data.message);
        getUsers();
      }
    } catch (err: any) {
      ToastError(JSON.stringify(err.response.data.details));
    }
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleDelete = (id: any, username: any) => {
    setUserinfo((prevUserinfo) => ({
      ...prevUserinfo,
      id: id,
    }));
    setUserinfo((prevUserinfo) => ({
      ...prevUserinfo,
      username: username,
    }));
    setArchive(true);
  };
  const handleUpdate = (values: any) => {
    const newUserinfo: Users = { ...userinfo };

    if (Object.keys(values).length > 0) {
      // console.log(values);
      (newUserinfo.id = values.id), (newUserinfo.username = values.username);
      newUserinfo.lastname = values.lastname;
      newUserinfo.middlename = values.middlename;
      newUserinfo.firstname = values.firstname;
      newUserinfo.contactNumber = values.contactNumber;
      newUserinfo.emailAddress = values.emailAddress;
      console.log(values.authorities)
      setSelectedAuthorities(values.authorities.split(","))
      setSelectedClients(values.client.split(","))
      // console.log(values.authorities)
    }
    setUserinfo(newUserinfo);
    setOpenEditModal(true);
  };
  const isAuthorityChecked = (value: string) =>
    selectedAuthorities.includes(value);
  const isClientChecked = (value: string) => selectedClients.includes(value);
  const handleAuthorities = (value: string) => {
    setSelectedAuthorities((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((option) => option !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };
  const handleClients = (value: string) => {
    setSelectedClients((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((option) => option !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };
  // const handleArchive = () => {
  //   setArchive(archive ? false : true);
  // };
  const handleAddUser = () => {
    setOpenAddModal(true);
  };
  const handleEditClient = async () => {
    await getUsers();
  };

  // Generic change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserinfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const ToastError = (message: string) => {
    toast("Error!", {
      style: { color: "red", backgroundColor: "#ffeae4" },
      className: "my-classname",
      description: message,
      duration: 3000,
      icon: <TriangleAlert className="w-5 h-5" />,
      closeButton: false,
    });
  };
  const ToastSuccess = (message: string) => {
    toast("Success", {
      style: { color: "#009900", backgroundColor: "white" },
      className: "my-classname",
      description: message,
      duration: 3000,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      closeButton: false,
    });
  };
  const addUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (
      !(
        userinfo.contactNumber.length >= 7 &&
        userinfo.contactNumber.length <= 15
      )
    ) {
      ToastError("Contact number's must be 7-15 length !");
    } else if (!regex.test(userinfo.password)) {
      ToastError(
        "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      );
    } else if (selectedAuthorities.length === 0) {
      ToastError("Authorities cannot be empty!");
    } else if (selectedClients.length === 0) {
      ToastError("Clients cannot be empty!");
    } else {
      const data = {
        username: userinfo.username,
        password: userinfo.password,
        firstname: userinfo.firstname,
        lastname: userinfo.lastname,
        emailAddress: userinfo.emailAddress,
        contactNumber: userinfo.contactNumber,
        authorities: selectedAuthorities,
        clients: selectedClients,
      };
      try {
        const response = await axios.post(`${baseUrl}credential/create`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        if (response.status === 200) {
          ToastSuccess(response.data.message);

          getUsers();
          setOpenAddModal(false);
        } else {
          ToastError("Something went wrong!");
        }
      } catch (err: any) {
        ToastError(JSON.stringify(err.response.data.details));
      }
    }
  };
  const updateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !(
        userinfo.contactNumber.length >= 7 &&
        userinfo.contactNumber.length <= 15
      )
    ) {
      ToastError("Contact number's must be 7-15 length !");
    } else if (selectedAuthorities.length === 0) {
      ToastError("Authorities cannot be empty!");
    } else if (selectedClients.length === 0) {
      ToastError("Clients cannot be empty!");
    } else {
      const data = {
        id: userinfo.id,
        username: userinfo.username,
        // password: userinfo.password,
        firstname: userinfo.firstname,
        lastname: userinfo.lastname,
        emailAddress: userinfo.emailAddress,
        contactNumber: userinfo.contactNumber,
        authorities: selectedAuthorities,
        clients: selectedClients,
      };
      // console.log(data)
      try {
        const response = await axios.post(`${baseUrl}credential/update`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        if (response.status === 200) {
          ToastSuccess(response.data.message);
          getUsers();
          setOpenEditModal(false);
        } else {
          ToastError("Something went wrong!");
        }
      } catch (err: any) {
        ToastError(JSON.stringify(err.response.data.details));
      }
    }
  };
  const clearUserInfo = () => {
    setUserinfo({
      id: 0,
      username: "",
      lastname: "",
      firstname: "",
      contactNumber: "",
      emailAddress: "",
      password: "",
      client: "",
      authorities: "",
    });
  };
  useEffect(() => {
    if (!openEditModal && !openAddModal) {
      setSelectedAuthorities([]);
      setSelectedClients([]);
      clearUserInfo();
    }
  }, [openAddModal, openEditModal]);
  useEffect(() => {
    if (!hasFetchedData.current) {
      getUsers();
      getClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);
  return (
    <div>
      <AlertDialog open={archive} onOpenChange={setArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to archive this user?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription></AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-800 hover:bg-red-900 dark:bg-slate-800 dark:text-white"
              onClick={deleteUser}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>
            <p>User Management</p>
          </CardTitle>
        </CardHeader>
        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogContent className="sm:max-w-[768px]">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <form onSubmit={addUser}>
              <div className="grid grid-cols-2 gap-2">
                <div className="md:col-span-1 col-span-2">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    value={userinfo.username}
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Lastname</Label>
                  <Input
                    type="text"
                    value={userinfo.lastname}
                    name="lastname"
                    onChange={handleChange}
                    placeholder="Lastname"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Firstname</Label>
                  <Input
                    type="text"
                    value={userinfo.firstname}
                    name="firstname"
                    onChange={handleChange}
                    placeholder="Firstname"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={userinfo.emailAddress}
                    name="emailAddress"
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Contact Number</Label>
                  <Input
                    type="number"
                    value={userinfo.contactNumber}
                    name="contactNumber"
                    onChange={handleChange}
                    placeholder="Contact Number"
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Password</Label>
                  <div className="flex items-center">
                    <Input
                      type={!showPassword ? "password" : "text"}
                      value={userinfo.password}
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                      className="pr-10"
                    />
                    {!showPassword ? (
                      <Eye
                        className="-ml-8"
                        onClick={() => handleShowPassword()}
                      />
                    ) : (
                      <EyeOff
                        className="-ml-8"
                        onClick={() => handleShowPassword()}
                      />
                    )}
                  </div>
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Authorities</Label>
                  <div className="flex flex-wrap gap-x-4">
                    {roles.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          checked={isAuthorityChecked(option)}
                          onChange={() => handleAuthorities(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Clients</Label>
                  <div className="flex flex-wrap gap-x-4">
                    {clients.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          checked={isClientChecked(option)}
                          onChange={() => handleClients(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-red-800 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-red-800/90 mt-2 dark:text-slate-300"
              >
                SUBMIT
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <DialogContent className="sm:max-w-[868px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <form onSubmit={updateUser}>
              <div className="grid grid-cols-2 gap-2">
                {/* <div className="md:col-span-1 col-span-2">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    value={userinfo.username}
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div> */}
                <div className="md:col-span-1 col-span-2">
                  <Label>Lastname</Label>
                  <Input
                    type="text"
                    value={userinfo.lastname}
                    name="lastname"
                    onChange={handleChange}
                    placeholder="Lastname"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Firstname</Label>
                  <Input
                    type="text"
                    value={userinfo.firstname}
                    name="firstname"
                    onChange={handleChange}
                    placeholder="Firstname"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="md:col-span-1 col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={userinfo.emailAddress}
                    name="emailAddress"
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Contact Number</Label>
                  <Input
                    type="number"
                    value={userinfo.contactNumber}
                    name="contactNumber"
                    onChange={handleChange}
                    placeholder="Contact Number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="md:col-span-1 col-span-2">
                  <Label>Authorities</Label>
                  <div className="flex flex-wrap gap-x-4">
                    {roles.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          checked={isAuthorityChecked(option)}
                          onChange={() => handleAuthorities(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Label>Clients</Label>
                  <div className="flex flex-wrap gap-x-4">
                    {clients.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          checked={isClientChecked(option)}
                          onChange={() => handleClients(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-red-800 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-red-800/90 mt-2 dark:text-slate-300"
              >
                UPDATE
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <CardContent>
          <DataTable
            clients={clients}
            data={users}
            columns={columns}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            addUser={handleAddUser}
            updateClient={handleEditClient}
          />
        </CardContent>
      </Card>
    </div>
  );
}
export default UserManagement;
