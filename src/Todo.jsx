import React, { useEffect, useState, useRef } from "react";
import { collection, addDoc, deleteDoc, doc, query, getDocs, where, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase_config";
import axios from "axios";
import './component/TodoCard.css'
import { AddAlert, Flag, Logout } from '@mui/icons-material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Menu, MenuItem, Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Login from '@mui/icons-material/Login';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import Tooltip from "@mui/material/Tooltip";
import Person2Icon from '@mui/icons-material/Person2';
import { useNavigate } from "react-router-dom";
import { Authcontext } from "./context/Authcontext";
import { useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from '@mui/material';



function Todo() {
  const [todos, setTodos] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [checkedTodos, setCheckedTodos] = useState({});
  const [warned, setWarned] = useState(false);
  const [del, setDel] = useState({});
  const [showModel, setShowModel] = useState(false);
  const [profileModel, setProfileModel] = useState(false);
  const [extraTime, setExtraTime] = useState(0);
  const [totaltime, setTotalTime] = useState(5 * 1000)
  const [warnedTime, setWarnedTimed] = useState(3 * 1000)
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [newEmail, setNewEmail] = useState();
  const [token, setToken] = useState();
  const [trigger, setTrigger] = useState(false);
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const modalRef = useRef();

  const { user, logOut } = useContext(Authcontext);



  useEffect(() => {
    setUserData(user);
  }, [])

  console.log("new user : ", user);


  // useEffect(() => {
  //   const Token = localStorage.getItem("authToken");

  //   setToken(Token);
  //   const userEmail = localStorage.getItem("userEmail");
  //   setNewEmail(userEmail);
  // }, [])




  // fetch data from firebase

  const fetchTask = async () => {
    const user = auth.currentUser;

    const getRef = collection(db, "tasks");
    const q = query(getRef, where("uid", "==", user.uid));
    const getTasks = await getDocs(q);
    const tasks = getTasks.docs;

    setTodos(tasks)

  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTask(user);
      }
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [trigger]);





  //  Add task to firebase
  const addTask = async () => {
    const user = auth.currentUser;
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: inputVal,
        status: false,
        uid: user.uid
      });
      setInputVal("");
      setTrigger((prev => !prev));
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


  // Delete Task from todo app 

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      fetchTask();
      console.log("Data is delete with id :", id)
    } catch (error) {
      console.log("Error in delete data.", error)
    }
  }


  // Update Task in todo
  const Update = async () => {
    if (inputVal.trim() === "") return;
    const taskRef = doc(db, "tasks", editingId);
    try {
      await updateDoc(taskRef, {
        title: inputVal
      })
      console.log("Task is updated successfully.");
      setInputVal('');
      setEditingId(null);

    } catch (error) {
      console.log("Error in updating task.", error);
    }
    fetchTask();
  }




  const handleTimeChange = (id) => {
    const newTime = (totaltime + (extraTime * 1000));
    setTotalTime(newTime);
    setWarnedTimed(newTime - 1 * 1000);
    setCheckedTodos((prev) => ({
      ...prev,
      [id]: true,
    }));
    if (setExtraTime) {
      setDel((prev) => ({
        ...prev,
        [id]: false,
      }));
      setShowModel(false);

    }

    alert("Time added");
    setExtraTime(0);
  }


  // hide model on button No button click 
  const hideModel = (id) => {
    console.log(id)
    setShowModel(false)
    setTimeout(() => {
      setCheckedTodos((prev) => ({
        ...prev,
        [id]: false
      }));
      setWarned(false);
      setDel((prev) => ({
        ...prev,
        [id]: true,
      }));
    },);
  }


  useEffect(() => {
    const timers = [];
    console.log("useEffect is called")

    Object.entries(checkedTodos).forEach(([id, isChecked]) => {
      if (isChecked) {
        const warningTimer = setTimeout(() => {
          // alert("Task will end in 1 minutes");
          setWarned(true);
        }, warnedTime);

        const endTimer = setTimeout(() => {
          alert("Task time is over");
          setCheckedTodos((prev) => ({
            ...prev,
            [id]: false
          }));
          setWarned(false);
          setDel((prev) => ({
            ...prev,
            [id]: true,
          }));
          setShowModel(true)
        }, totaltime);

        timers.push(warningTimer, endTimer);
      }
    });


    return () => {
      timers.forEach(clearTimeout);

    };

  }, [checkedTodos, totaltime]);







  const startEdit = (todo) => {
    setEditingId(todo.id);
    setInputVal(todo.data().title);
  }

  // handling checkbox status
  const handleCheckChange = (id) => {
    setCheckedTodos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }




  const logIn = () => {
    navigate('/login');
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    setProfileModel(true)
  }


  // Profile modal handling 
  const handleProfileModal = () => {
    setProfileModel(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setProfileModel(false);
      }
    };

    if (profileModel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileModel, setProfileModel]);


  return (
    <>
      <div className="todo-card" >
        <div className="header">

          <h2 className="heading">React CRUD with firebase</h2>
          <div>

            {/* {
              token ? <Button variant="contained" color="primary" aria-label="log-out" className="logout" onClick={() => logOut()}><Logout sx={{ mr: 1 }} /> Log Out</Button> : <Button variant="contained" color="primary" aria-label="log-in" onClick={() => logIn()}>Log In</Button>
            } */}


            <Button
              variant="contained"
              color="primary"
              aria-controls="auth-menu"
              aria-haspopup="true"
              onClick={handleClick}
              startIcon={
                user && user?.imageUrl ? (
                  <Avatar src={user?.imageUrl} alt="Profile" sx={{ width: 24, height: 24 }} />
                ) : null
              }
            >
              {user ? 'Account' : 'Login'}
            </Button>

            <Menu
              id="auth-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {user ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleProfile();
                      // Optional: navigate('/profile');
                    }}
                  >
                    <Person2Icon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      logOut();
                      handleClose();
                    }}
                  >
                    <Logout sx={{ mr: 1 }} />
                    Log Out
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  onClick={() => {
                    logIn();
                    handleClose();
                  }}
                >
                  <Login sx={{ mr: 1 }} />
                  Log In
                </MenuItem>
              )}
            </Menu>




            {newEmail && <p className="email_para" style={{ marginTop: '0', marginBottom: '35px', color: 'lightslategray' }}>{newEmail}</p>}

          </div>
        </div>


        <input className="input_field"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter todo..."
        />
        {editingId ? (
          <Tooltip title="Update Task" placement="right">
            <Button variant="contained" sx={{ backgroundColor: '#c2185b', '&:hover': { backgroundColor: '#880e4f' } }} onClick={Update} className="update_btn"><SecurityUpdateGoodIcon /></Button>
          </Tooltip>

        ) : (
          <Tooltip title="Add Task" placement="right">
            <Button variant="contained" onClick={addTask} className="add_btn"><AddIcon /></Button>
          </Tooltip>
        )}

        <ul className="list_name">
          {todos.map((todo) => (
            <li key={todo.id} className="lists">
              {del[todo.id] ? <del> {todo.data().title} </del> : todo.data().title}
              <div className="btn_div">
                <Tooltip title="Edit Task" placement="left">
                  <Button variant="contained" color="success"
                    onClick={() => startEdit(todo)}
                    className="edit_btn">
                    <EditDocumentIcon />
                  </Button>
                </Tooltip>

                <Tooltip title="Delete Task" placement="top">
                  <Button variant="contained" color="error" onClick={() => deleteTask(todo.id)} className="del_btn" sx={{
                    margin: '0 15px'
                  }}><DeleteForeverIcon /></Button>
                </Tooltip>


                <input

                  type="checkbox"
                  disabled={
                    del[todo.id] ? true : false
                  }
                  className="check"
                  checked={checkedTodos[todo.id]}
                  onChange={() => {
                    handleCheckChange(todo.id);
                    setActiveTodoId(todo.id);
                  }}
                />

              </div>
            </li>
          ))}
        </ul>
      </div>



      <Dialog open={showModel} onClose={() => hideModel(activeTodoId)}>
        <DialogTitle>Want to take some more time?</DialogTitle>

        <DialogContent>
          <TextField
            type="number"
            label="Add Extra Time"
            variant="outlined"
            fullWidth
            margin="dense"
            onChange={(e) => setExtraTime(Number(e.target.value))}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleTimeChange(activeTodoId)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => hideModel(activeTodoId)}
          >
            NO
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={profileModel} onClose={() => setProfileModel(false)} ref={modalRef}>
        <DialogTitle>Profile</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar
              src={user?.imageUrl}
              alt="Profile"
              sx={{ width: 100, height: 100 }}
            />
            {user && (
              <Typography variant="body1" color="textSecondary">
                {user?.email}
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default Todo;
