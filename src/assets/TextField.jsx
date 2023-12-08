import React, { useState, useEffect } from "react";

export default function TextField(props) {
  const [text, setText] = useState(props.data || []);

  useEffect(() => {
    // Set the initial state of text when the data prop changes
    setText(props.data || []);
  }, [props.data]);

  function updateProperty() {
    const newState = { ...props.all };
    newState["Education"] = text;
    props.setall(newState);
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
          updateProperty();
        }}
      />
      <button onClick={() => handleDeleteTextField(index)}>-</button>
    </div>
  ));

  return (
    <div>
      {fields}
      <button onClick={handdleAdd}>+</button>
    </div>
  );
}
