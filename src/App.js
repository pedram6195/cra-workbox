import useOnlineStatus from "@rehooks/online-status";
import axios from "axios";
import clsx from "clsx";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const {
    data: users,
    isLoading,
    isError
  } = useQuery("users", () =>
    axios.get("https://reqres.in/api/users").then(res => res.data.data)
  );

  const addToCache = async () => {
    const myCache = await window.caches.open("users");
    await myCache.addAll(["https://reqres.in/api/users"]);
    console.log("all users added to cache...");
  };

  const getCache = async () => {
    window.caches
      .open("users")
      .then(cache => cache.match("https://reqres.in/api/users"))
      .then(response => response.json())
      .then(res => console.log(res.data));
  };

  const online = useOnlineStatus();

  if (isError) return <div>error in getting data</div>;

  if (isLoading) return <div>fetching users list ...</div>;

  return (
    <>
      <p className={clsx("text", online ? "online" : "offline")}>
        your network status: {online ? "online" : "offline"}
      </p>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>email</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>avatar</th>
            <th>edit user</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>
                <img src={user.avatar} alt="avatar" />
              </td>
              <td>
                <Link to={`/users/${user.id}`}>edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addToCache} className="save-cache">
        save users in cache
      </button>
      <button onClick={getCache} className="save-cache">
        log cache in console
      </button>
    </>
  );
}

export default App;
