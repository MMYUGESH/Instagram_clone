import React, { useState, useEffect } from 'react';
import "./App.css";
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';





function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
        /*  if (authUser.displayName) {
            //dont update username
          } else {
            //if we just created someone
            return authUser.updateProfile({
              displayName: username,
            });
          }*/


      } else {
        //user has logged out
        setUser(null);
      }
    })
    return () => {

      //cleanup actions is performed 
      unsubscribe();
    }

  }, [user, username]);

  useEffect(() => {

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {

      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })

  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));

    setOpenSignIn(false);

  }


  return (
    <div className="app">



      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
          </center>
          <form className="app_signup">

            <Input placeholder="UserName" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
          </center>
          <form className="app_signup">



            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      <div className="app_header">
        <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />


        {user ? (<Button onClick={() => auth.signOut()} >Log Out</Button>) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
            <Button onClick={() => setOpen(true)} >Sign Up</Button>
          </div>
        )}


      </div>

      <div className="app_posts">

        {
          posts.map(({ id, post }) => (
            <div key={id}>
              <Post postId={id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl} />
            </div>
          ))
        }

      </div>






      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Login to upload</h3>
      )}




    </div >
  );
}

export default App;
