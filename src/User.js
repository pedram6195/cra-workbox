import useOnlineStatus from "@rehooks/online-status";
import axios from "axios";
import clsx from "clsx";
import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const online = useOnlineStatus();
  const navigate = useNavigate();

  const getOnlineUser = id => {
    return axios
      .get(`https://reqres.in/api/users/${id}`)
      .then(res => res.data.data);
  };

  const getOfflineUser = id => {
    return window.caches
      .open("users")
      .then(cache => cache.match("https://reqres.in/api/users"))
      .then(response => response.json())
      .then(res => res.data.find(user => user.id === +id));
  };

  const {
    data: user,
    isLoading,
    isError
  } = useQuery(
    ["user", id, online],
    () => (online ? getOnlineUser(id) : getOfflineUser(id)),
    { enabled: !!id }
  );

  const { register, handleSubmit } = useForm();

  const onSubmit = values => {
    axios
      .patch(`https://reqres.in/api/users/${id}`, values)
      .then(() => {
        console.log("user info updated...");
        navigate("/");
      })
      .catch(err => {
        if (err.response === undefined && !online) navigate("/");
      });
  };

  if (isError) return <div>error in getting data</div>;

  if (isLoading) return <div>fetching user data ...</div>;

  return (
    <>
      <p className={clsx("text", online ? "online" : "offline")}>
        your network status: {online ? "online" : "offline"}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("first_name", { required: true })}
          placeholder="first name"
          defaultValue={user.first_name || ""}
        />
        <input
          type="text"
          {...register("last_name", { required: true })}
          placeholder="last name"
          defaultValue={user.last_name || ""}
        />
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="email"
          defaultValue={user.email || ""}
        />
        <button className="submit">submit</button>
      </form>
    </>
  );
};

export default User;
