import React, { useState, useEffect } from "react";
import axios from "axios";
import FileBase from 'react-file-base64';
import {  social } from './Navbar/data';
const Crud = () => {
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    cuisineType: "",
    location: "",
    selectedFile: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    name: "",
    cuisineType: "",
    location: "",
    selectedFile: "",
  });

  const [listItems, setListItems] = useState([]);
  
  const addItem = async (e) => {
    e.preventDefault();
    //if (
    //   notes.name &&
    //   notes.cuisineType &&
    //   notes.location &&
    //   notes.selectedFile
    // ) {
      try {
        const res = await axios.post(
          "https://restaurant-mern.onrender.com/api/v1/restaurants",
          createForm
        );
        //console.log(res);
        setNotes([...notes , res.data.note]);
        //clear form state
        setCreateForm({
          name: "",
          cuisineType: "",
          location: "",
          selectedFile: "",
        });
      } catch (error) {
        console.log(error);
      }
    // } else {
    //   alert("Fill all fields");
    // }
  };
  //fetch all restaurant details from database
  useEffect(() => {
    const getItemsList = async () => {
      try {
        //fetch the data
        const res = await axios.get("https://restaurant-mern.onrender.com/api/v1/restaurants");
        //set to state
        setNotes(res.data.notes);
        //console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getItemsList();
  }, []);

  //delete item
  const deleteItem = async (_id) => {
    try {
      const res = await axios.delete(
        `https://restaurant-mern.onrender.com/api/v1/restaurants/${_id}`
      );
      alert("Delete item?");
      const newListItems = [...notes].filter((note) => {
        return note._id !== _id;
      });
      setNotes(newListItems);
    } catch (error) {
      //console.log(error);
    }
  };
  //update create form
  const updateCreateFormField = (e) => {
    const { name, value } = e.target;
    setCreateForm({
      ...createForm,
      [name]: value,
    });
  };

  //  update form
  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  const toggleUpdate = (note) => {
    //set state on update form

    setUpdateForm({
      name: note.name,
      cuisineType: note.cuisineType,
      location: note.location,
      selectedFile: note.selectedFile,
      _id: note._id,
    });
  };

  const updateNote = async () => {
    const { name, cuisineType, location, selectedFile } = updateForm;
    //send the update request
    const res = axios.patch(
      `https://restaurant-mern.onrender.com/api/v1/restaurants/${updateForm._id}`,
      { name, cuisineType, location, selectedFile }
    );
    //update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex((note) => {
      return note._id == updateForm._id;
    });
    newNotes[noteIndex] = (await res).data.note;
    setNotes(newNotes);
    //clear update form state
    setUpdateForm({
      _id: null,
      name: "",
      cuisineType: "",
      location: "",
      selectedFile: "",
    });
  };
  const handleImageUpload = (e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
      const base64String = reader.result;
      // setCreateForm({
      //   ...createForm,
      //   base64String
      // });
      console.log(base64String);
      if (file){
        reader.readAsDataURL(file)
      }

    }
  }
  return (
    <>
      <div>
        <div className="forms"></div>
        {updateForm._id && (
          <div className="update">
            <h2>Update </h2>
            <form onSubmit={updateNote}>
              <div className="form-control">
                <label htmlFor="name">Restaurant Name:</label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  value={updateForm.name}
                  onChange={handleUpdateFieldChange}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="cuisineType">CuisineType:</label>
                <input
                  name="cuisineType"
                  id="cuisineType"
                  type="text"
                  value={updateForm.cuisineType}
                  onChange={handleUpdateFieldChange}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="location">Location:</label>
                <input
                  name="location"
                  id="location"
                  type="text"
                  value={updateForm.location}
                  onChange={handleUpdateFieldChange}
                  required
                />
              </div>

              <button className="btn" type="submit">Update</button>
            </form>
          </div>
        )}
        {!updateForm._id && (
          <div className="createform">
            <p>Add restaurant details</p>
            <form onSubmit={addItem}>
              
              <div className="form-control">
                <label htmlFor="name">Restaurant Name:</label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  value={createForm.name}
                  onChange={updateCreateFormField}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="cuisineType">CuisineType:</label>
                <input
                  name="cuisineType"
                  id="cuisineType"
                  type="text"
                  value={createForm.cuisineType}
                  onChange={updateCreateFormField}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="location">Location:</label>
                <input
                  name="location"
                  id="location"
                  type="text"
                  value={createForm.location}
                  onChange={updateCreateFormField}
                  required
                />
              </div>
               {/* <div className="form-control">
                <label htmlFor="selectedFile">Restaurant Image</label>
                <input
                  name="selectedFile"
                  id="selectedFile"
                  type="file"
                  value={createForm.selectedFile}
                  onChange={handleImageUpload}
                  required
                />
              </div>  */}
               <div className="form-control">
              <FileBase name="selectedFile"
                  id="selectedFile"
                  value={createForm.selectedFile}
                  onChange={updateCreateFormField}
                  required type='file' multiple={false} onDone={({base64})=>setCreateForm({...createForm,selectedFile:base64})} />
              </div> 
              <button className="btn" type="submit">Add details</button>
            </form>
          </div>
        )}

        <div className="details">
          {notes &&
            notes.map((note) => {
              return (
                <div key={Math.random().toString()} className="single-detail">
                  <img className="singleimage" src={note.selectedFile} alt="image" />
                  <p className="name">{note.name}</p>
                  <p className="cuisineType">{note.cuisineType}</p>
                  <p className="location">{note.location}</p>
                  {/* <p>{note.selectedFile}</p> */}
                  
                  <div className="buttons">
                  <button className="btn"
                    onClick={() => {
                      deleteItem(note._id);
                    }}>
                    Delete
                  </button>
                  <button className="btn"
                    onClick={() => {
                      toggleUpdate(note);
                    }}>
                    Update
                  </button>
                  </div>
                  
                </div>
              );
            })}
        </div>
      </div>
      <footer >
      <div className="footer__container">
            <h2><span>w</span>innie <span>a</span>tieno</h2>
            <h3>Your complete web solution</h3>
            <ul className='social-icons'>
          {social.map((socialIcon) => {
            const { id, url, icon } = socialIcon;
            return (
              <li className="icons" key={id}>
                <a href={url}>{icon}</a>
              </li>
            );
          })}
        </ul>
            <p>Copyright &copy; 2022 Winnie. All rights reserved</p>
        </div>
      </footer>
    </>
  );
};
export default Crud;
