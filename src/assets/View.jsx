import React, { useState } from "react";
import CreateUser from "./CreateUser";
import { Link } from "react-router-dom";

export default function View({ data }) {
  const [edit, setEdit] = useState("");
  const [search, setSearch] = useState("");
  let a = "";
  const handleRowClick = (id) => {
    console.log("Clicked on row with id:", id);
    setEdit(id);
  };

  console.log(data);

  if (!data) {
    return <h1>Loading...</h1>;
  }

  if (data.length === 0) {
    return <h1>Sorry, No Records Found</h1>;
  }

  const tableHeaders = Object.keys(data[0]).map((key) => (
    <th key={key}>{key}</th>
  ));

  const filteredData = data.filter((item) => {
    const fullName = `${item["First Name"]} ${item["Last Name"]}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const tableRows = filteredData.map((item, index) => (
    <tr
      key={index}
      onClick={() => handleRowClick(item["uid"])}
      className="table-row"
    >
      <td>{item["uid"]}</td>
      <td>{item["First Name"]}</td>
      <td>{item["Last Name"]}</td>
      <td>{item["Address"]}</td>
      <td className="img-slot">
        <img src={item["imageURL"]} alt="Sorry Something Went Wrong" />
      </td>
      <td>{item["Date Of Birth"]}</td>
      <td>{item["Phone Number"]}</td>
      <td>
        <a className="res-btn" href={item["resumeURL"]} target="_blank">
          view
        </a>
      </td>
      <td>{item["Education"][0]}</td>
      <td><Link to={`/create/${item["uid"]}`}> <button >Edit and View This Record</button></Link></td>
    </tr>
  ));

  return (
    <>
      <div className="view-cont">
        <input
          type="text"
          placeholder="Start Typing"
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          value={search}
          name="search"
          id=""
        />
        <table className="table">
          <thead>
            <tr>{tableHeaders}</tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </>
  );
}
