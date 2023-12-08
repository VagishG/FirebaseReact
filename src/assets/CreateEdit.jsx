import React from "react";
import { useState } from "react";
import TextField from "./TextField";
import Files from "./Files";
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import db from "./Database";
import { nanoid } from "nanoid";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { useEffect } from "react";
import { editingStateInitializer } from "@mui/x-data-grid/internals";
import { useParams } from "react-router-dom";
import { Route, redirect } from "react-router-dom";
export default function CreateEdit() {
  let { uid } = useParams();
  const [data, SetData] = useState({
    "First Name": "",
    "Last Name": "",
    Address: "",
    "Date Of Birth": "",
    "Phone Number": "",
    resumeURL: "",
    imageURL: "",
    Education: [],
    image: null,
    resume: null,
    lockButton:false
  });
  const storage = getStorage();
  const storageRef = ref(storage, "files");

  function handleOnChange(event) {
    const { name, value } = event.target;
    SetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handdleAdd() {
    const temp = data["Education"];
    temp.push("");
    SetData((prev) => {
      return { ...data, Education: temp };
    });
  }

  function handleDeleteTextField(index) {
    console.log(index);
    SetData((prev) => {
      const temp = [...prev["Education"]];
      console.log(temp);
      temp.splice(index, 1);
      return { ...data, Education: temp };
    });
  }

  const fields = data["Education"].map((t, index) => (
    <div key={index}>
      <input
        type="text"
        value={t}
        onChange={(e) => {
          const updatedTextFields = data["Education"];
          updatedTextFields[index] = e.target.value;
          SetData({ ...data, Education: updatedTextFields });
        }}
      />
      <button onClick={() => handleDeleteTextField(index)}>-</button>
    </div>
  ));

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "Data", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newData = docSnap.data();
        SetData((prevData) => ({
          ...prevData,
          "First Name": newData["First Name"] || "",
          "Last Name": newData["Last Name"] || "",
          Address: newData["Address"] || "",
          "Date Of Birth": newData["Date Of Birth"] || "",
          "Phone Number": newData["Phone Number"] || "",
          resumeURL: newData["resumeURL"] || "",
          Education: newData["Education"] || [],
          imageURL: newData["imageURL"],
        }));
      } else {
        console.log("No such document!");
      }
    };
    if (uid) {
      fetchData();
    }
  }, [uid]);

  async function SubmitData() {
    if (uid) {
      console.log("hui");
      console.log(uid);

      if (data["image"]) {
        const imageDel = ref(storage, data["imageURL"]);
        deleteObject(imageDel)
          .then(() => {
            console.log("Image deleted success");
          })
          .catch((error) => {
            console.log(error);
          });

        const photoRef = ref(storageRef, `${"image" + uid}`);
        uploadBytes(photoRef, data["image"]).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
      }
      if (data["resume"]) {
        const resumeDel = ref(storage, data["resumeURL"]);
        deleteObject(resumeDel)
          .then(() => {
            console.log("Resune deleted success");
          })
          .catch((error) => {
            console.log(error);
          });
        const resumeRef = ref(storageRef, `${"resume" + uid}`);
        uploadBytes(resumeRef, data["resume"]).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
      }

      // Method Two
      // if(data["image"]){
      //   const resumeRef = ref(storageRef, `${"image"+uid}`);
      //   uploadBytes(resumeRef, data["imgae"]).then((snapshot) => {
      //     console.log('Uploaded a blob or file!');
      //   });
      // }
      // if(data["resume"]){
      //   const resumeRef = ref(storageRef, `${"resume"+uid}`);
      //   uploadBytes(resumeRef, data["resume"]).then((snapshot) => {
      //     console.log('Uploaded a blob or file!');
      //   });
      // }

      const washingtonRef = doc(db, "Data", uid);
      await updateDoc(washingtonRef, {
        "First Name": data["First Name"],
        "Last Name": data["Last Name"],
        Address: data["Address"],
        "Date Of Birth": data["Date Of Birth"],
        "Phone Number": data["Phone Number"],
        Education: data["Education"],
        imageURL: `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fimage${uid}?alt=media`,
        resumeURL: `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fresume${uid}?alt=media`,
      });
    } else {

      SetData({...data,lockButton:true})
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      if(data["Date Of Birth"]>formattedDate){
        window.alert("Future mein paida hona chahata hai?")
        return;
      }

      if (data["resume"] === null || data["image"] === null) {
        window.alert("Please select a file");
        return;
      }
      uid = nanoid();
      const photoRef = ref(storageRef, `${"image" + uid}`);
      const resumeRef = ref(storageRef, `${"resume" + uid}`);
      try {
        uploadBytes(photoRef, data["image"]).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
        uploadBytes(resumeRef, data["resume"]).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
        SetData((prev) => {
          return {
            ...prev, // Spread the previous state
            imageURL: `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fimage${uid}?alt=media`,
            resumeURL: `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fresume${uid}?alt=media`,
          };
        });
      } catch (error) {
        console.log(error);
        window.alert(error);
        return;
      }
      try {
        await setDoc(doc(db, "Data", uid), {
          "First Name": data["First Name"],
          "Last Name": data["Last Name"],
          Address: data["Address"],
          "Date Of Birth": data["Date Of Birth"],
          "Phone Number": data["Phone Number"],
          Education: data["Education"],
          imageURL: `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fimage${uid}?alt=media`,
          resumeURL: `https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fresume${uid}?alt=media`,
        });
      } catch (error) {
        console.log(error);
        window.alert(error);
        deleteObject(photoRef)
        .then(() => {})
          .catch((error) => {
            console.log(error);
          });
          deleteObject(resumeRef)
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
          return;
      }
    }
    window.alert("Done Data");
    window.location.href="/home"    
    redirect("/home");
  }
  async function deleteRecord() {
    if (!uid) {
      window.alert("Nothing To delete");
    } else {
      try {
        await deleteDoc(doc(db, "Data", uid));
      } catch (error) {
        console.log(error);
        window.alert("Some error in deleting the data");
        return;
      }
      const imageDel = ref(storage, data["imageURL"]);
      const resumeDel = ref(storage, data["resumeURL"]);
      deleteObject(imageDel)
        .then(() => {
          console.log("Image deleted success");
        })
        .catch((error) => {
          console.log(error);
        });
      deleteObject(resumeDel)
        .then(() => {
          console.log("Resune deleted success");
        })
        .catch((error) => {
          console.log(error);
        });
      window.alert("Done Deleting");
    }
    window.location.href="/home"    
    // redirect("/home");
  }

  return (
    <div className="container">
      <div className="form">
        {/* <p>First Name:</p> */}
        <input
          type="text"
          name="First Name"
          id=""
          placeholder="First Name"
          onChange={handleOnChange}
          value={data["First Name"]}
        />
        <input
          type="text"
          name="Last Name"
          id=""
          placeholder="Last Name"
          onChange={handleOnChange}
          value={data["Last Name"]}
        />
        <input
          type="text"
          name="Address"
          id=""
          placeholder="Address"
          onChange={handleOnChange}
          value={data["Address"]}
        />
        <input
          type="date"
          name="Date Of Birth"
          id=""
          placeholder="Date Of Birth"
          onChange={handleOnChange}
          value={data["Date Of Birth"]}
        />
        <input
          type="number"
          name="Phone Number"
          id=""
          placeholder="Phone Number"
          onChange={handleOnChange}
          value={data["Phone Number"]}
        />

        {fields}
        <button className="qual-ctrl" onClick={handdleAdd}>
          +
        </button>

        <div className="p">
          {uid && (
            <div className="display">
              <img src={data["imageURL"]} alt="" />
              <iframe
                src={data["resumeURL"]}
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}

          <Files
            accept="image/*"
            setData={SetData}
            text={"Select Your Profile Image"}
          />
          {data["image"] && (
            <img
              src={URL.createObjectURL(data["image"])}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}
          <Files accept=".pdf" setData={SetData} text={"Select Your Resume"} />
          {data["resume"] && (
            <iframe
              src={URL.createObjectURL(data["resume"])}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}

          <button onClick={SubmitData} disabled={data["lockButton"]} className="submit-btn">
            Submit Data
          </button>
          <button onClick={deleteRecord} className="submit-btn">
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
}
