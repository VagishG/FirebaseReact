import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './assets/Home';
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from 'react';
import db from "./assets/Database"
import { useState } from 'react';
import CreateUser from './assets/CreateUser';
import View from './assets/View';
import CreateEdit from './assets/CreateEdit';
const About = () => <CreateEdit />; // Assuming Home is your about page component

const App = () => {
  
  const [data,SetData]=useState([{
    "uid":"",
    "First Name":"",
    "Last Name":"",
    "Address":"",
    "image":"",
    "Date Of Birth":"",
    "Phone Number":"",
    "resume":"",
    "Education":[]
  }])


  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Data"));
      let newData = []; // Create a new array to avoid mutating state directly
  
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

        let a = {
          "uid": doc.id,
          "First Name": doc.data()["First Name"],
          "Last Name": doc.data()["Last Name"],
          "Address": doc.data()["Address"],
          "imageURL": doc.data()["imageURL"],
          "Date Of Birth": doc.data()["Date Of Birth"],
          "Phone Number": doc.data()["Phone Number"],
          "resumeURL": doc.data()["resumeURL"],
          "Education": doc.data()["Education"] || [],
        };
  
        newData.push(a);
      });
  
      SetData(newData); // Update the state with the new data
    };
  
    fetchData(); // Call the async function inside useEffect
  
  }, []);
    // console.log(data)
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/create" element={<About />} />
        <Route path="/create/:uid" element={<About />} />
        <Route path="/view" element={<View data={data} />} />
        <Route path="/home" element={<Home data={data}/>} />
        <Route path="/" element={<Home data={data}/>} />

      </Routes>
    </Router>
  );
};

export default App;
