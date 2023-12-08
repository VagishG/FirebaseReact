import React from 'react'
import { useState } from 'react'
import TextField from './TextField'
import Files from './Files'
import { doc, setDoc,getDoc,deleteDoc } from "firebase/firestore"
import db from "./Database"
import {nanoid} from "nanoid"
import { getStorage, ref, uploadBytes,deleteObject } from "firebase/storage";
import { useEffect } from 'react'
export default function CreateUser(props) {
    // function debug(){
    //     console.log(data)
    // }
    const storage = getStorage();
    const storageRef = ref(storage, 'files');
    const [data,SetData]=useState({
        "uid":"",
        "First Name":"",
        "Last Name":"",
        "Address":"",
        "Date Of Birth":"",
        "Phone Number":"",
        "resume":"",
        "image":"",
        "Education":[]
      })
      let uid="";
      const [edit,SetEdit]=useState(false)
      const [butt,setbutt]=useState(false)

      useEffect(() => {
        const fetchData = async () => {
            // console.log("da")
            uid=props.id
            const docRef = doc(db, 'Data', props.id);
            const docSnap = await getDoc(docRef);
            SetEdit(true)
            if (docSnap.exists()) {
              const newData = docSnap.data();
              
              // console.log(props.id) 
              SetData((prevData) => ({
                ...prevData,
                "uid": props.id,
                "First Name": newData["First Name"] || '',
                "Last Name": newData["Last Name"] || '',
                "Address": newData["Address"] || '',
                "Date Of Birth": newData["Date Of Birth"] || '',
                "Phone Number": newData["Phone Number"] || '',
                "resume": newData["resume"] || '',
                "Education": newData["Education"] || [],
                "image":newData["image"]
              }));
              setText(newData["Education"])
      
              // For the image field
            } else {
              console.log('No such document!');
            }
          };
          if(props.id){ 
            fetchData();
          }
          
      }, [props.id]);
      const [text, setText] = useState([]);
      // console.log(data)
      const [image,setImage]=useState(null)
      const [resume,setResume]=useState(null)
      async function uploadFiles(a){
        const filesFolderRefresume = ref(storageRef, `${"resume" + a}`);
        const filesFolderRefphoto = ref(storageRef, `${"photo" + a}`);
        await uploadBytes(filesFolderRefresume, resume);  
        await uploadBytes(filesFolderRefphoto, image);
        console.log('File uploaded successfully!');
        window.alert("Done Data")
      }
      function handleOnChange(event){

        const { name, value } = event.target;
        SetData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      async function deleteFiles(file,type){
        const desertRef = ref(storage, file);
        deleteObject(desertRef).then(() => {
          console.log("File Deleted")
        }).catch((error) => {
          console.log(error)
          SetData({...data,type:""})
          console.log(data)
          // Uh-oh, an error occurred!
        });
        
        await setDoc(doc(db,"Data",data["uid"]),{...data,type:""})
      }
      async function updateData(){
        // let a=data["uid"]
        console.log(uid)
        
        if(resume!=null){
          deleteFiles(data["resume"],"resume");
          console.log("doing")
          const filesFolderRefresume = ref(storageRef, `${"resume"+data["uid"]}`);
          await uploadBytes(filesFolderRefresume, resume);  
          console.log('File uploaded successfully!'); 
          await setDoc(doc(db,"Data",data["uid"]),{...data,Education:text,resume:`https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fresume${data["uid"]}?alt=media`})
        }
        if(image!=null){
          deleteFiles(data["image"],"image");
          console.log("doing")
          const filesFolderRefphoto = ref(storageRef, `${"photo"+data["uid"]}`);
          await uploadBytes(filesFolderRefphoto, image);
          console.log('File uploaded successfully!'); 
          await setDoc(doc(db,"Data",data["uid"]),{...data,Education:text,image:`https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fphoto${data["uid"]}?alt=media`})
        }
        await setDoc(doc(db,"Data",data["uid"]),{...data,Education:text})
        console.log("Done")
        window.alert("Data was updated")
      }
      
      function setdisabe(){
        setbutt(true)
        setTimeout(()=>{
          setbutt(false)
        },10000)
      }

      async function submitData(){
        setdisabe()
        // window.location.reload(true)
        let a=nanoid()
        SetData({...data,"uid":a}) 
        await setDoc(doc(db, "Data",a),{
          ...data,
          Education:text,
          resume:`https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fresume${a}?alt=media`,
          image:`https://firebasestorage.googleapis.com/v0/b/reactproject-4f0fd.appspot.com/o/files%2Fphoto${a}?alt=media`
        });
        uploadFiles(a)
        
        // location.reload()  
      }
      // console.log(edit)
      async function deleteEverything(){
        deleteFiles(data["resume"],"resume")
        deleteFiles(data["image"],"image")
        await deleteDoc(doc(db, "Data",data["uid"]));
        // window.location.reload(true)
        window.alert("Done deleting")
      }

      function updateProperty() {
        const newState = { ...data };
        newState["Education"] = text;
        SetData(newState);
      }
    
      function handdleAdd() {
        setText((prevTextFields) => [...prevTextFields, ""]);
      }
    
      function handleDeleteTextField(index) {
        setText((prevTextFields) => {
          const updatedTextFields = [...prevTextFields];
          updatedTextFields.splice(index, 1);
          return updatedTextFields;
        });
      }
      
      const fields = text.map((t, index) => (
        <div key={index}>
          <input
            type="text"
            value={t}
            onChange={(e) => {
              const updatedTextFields = [...text];
              updatedTextFields[index] = e.target.value;
              setText(updatedTextFields);
            }}
          />
          <button onClick={() => handleDeleteTextField(index)}>-</button>
        </div>
      ));


    return (
    <div className='container'>
        <div className="form">
            {/* <p>First Name:</p> */}
            <input type="text" name="First Name" id=""  placeholder="First Name" onChange={handleOnChange} value={data["First Name"]}/>
            <input type="text" name="Last Name" id=""  placeholder="Last Name" onChange={handleOnChange} value={data["Last Name"]}/>
            <input type="text" name="Address" id=""  placeholder="Address" onChange={handleOnChange} value={data["Address"]}/>
            <input type="date" name="Date Of Birth" id=""  placeholder="Date Of Birth" onChange={handleOnChange} value={data["Date Of Birth"]}/>
            <input type="number" name="Phone Number" id=""  placeholder="Phone Number" onChange={handleOnChange} value={data["Phone Number"]}/>
            {/* {edit? : } */}
            {/* {console.log(data)} */}
            {fields}
      <button className='qual-ctrl' onClick={handdleAdd}>+</button>
            {edit?
            <>
              <img src={data["image"]} alt="" />
              <Files resume={false} accept="image/jpeg, image/png, image/gif" selectedFile={image} setSelectedFile={setImage} />

              <a href={data["resume"]} target='_blank'>
                Click Here to open pdf in full screen
              <embed src={data["resume"]} type="application/pdf" />
              </a>
              <button onClick={()=>{deleteFiles(data["resume"],"resume")}} className='submit-btn'>Delete Resume</button>
              <button onClick={()=>{deleteFiles(data["image"],"image")}} className='submit-btn'>Delete Image</button>
              <Files resume={true} accept="application/pdf" selectedFile={resume} setSelectedFile={setResume}/>
              <button onClick={updateData} className='submit-btn'>Update Data</button>
              <button onClick={deleteEverything} className='submit-btn'>Delete Record</button>
            </>
            :
            <div className="p">
              <Files resume={false} accept="image/jpeg,image/png" selectedFile={image} setSelectedFile={setImage} text={"Choose image"} />
              <Files resume={true} accept="application/pdf,application/docx" selectedFile={resume} setSelectedFile={setResume} text={"Choose Resume"}/>
          <button onClick={submitData} className='submit-btn' disabled={butt}>Submit Data</button>
            </div>
          }
        </div>
        
    </div>
  )
}
