import React, { useState } from 'react';

const Files = (props) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {

      if(file.type.startsWith("image/")){
        props.setData((prev)=>{
          return({...prev, image:file})
        })
      }
      else{
        props.setData((prev)=>{
          return({...prev, resume:file})
        })
      }

    } 
  };



  return (
    <div>
      <label htmlFor="fileInput">{props.text}</label>
      <input
        type="file"
        id="fileInput"
        accept={props.accept} // Set the accepted file types explicitly
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Files;
