import React, { useState, useRef, useEffect } from 'react'
import './Posts.css'
import Button from '@mui/material/Button';
import axios from 'axios'
import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD7xIwFwbEyiM5F1Ab6x-1-fCZ9OQbaBQ4",
    authDomain: "hassan-nadeem.firebaseapp.com",
    projectId: "hassan-nadeem",
    storageBucket: "hassan-nadeem.appspot.com",
    messagingSenderId: "500168728643",
    appId: "1:500168728643:web:b2101508ea2b3dcc0174f6",
    measurementId: "G-8X7HC9ERLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
//Database Landler
const db = getFirestore(app);


const Posts = () => {
    const [posts, setposts] = useState([]);
    const [postText, setPostText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const getAlldata = async () => {

            const querySnapshot = await getDocs(collection(db, "posts"));
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} =>`, doc.data());


                setposts((prev) => {

                    let newArrays = [...posts, doc.data()];
                    console.log("newArrays", newArrays);

                    return newArrays
                });
            });
        }
        getAlldata()

    }, [])




    const savePost = async (e) => {
        e.preventDefault();
        // console.log("savePost:", savePost)
        console.log("postText:", postText)

        try {
            const docRef = await addDoc(collection(db, "posts"), {
                text: postText,
                createdOn: new Date().getTime(),
            });
            console.log("Document written with ID: ", docRef.id);

            
            let timerInterval;
            Swal.fire({
                title: "Post Created",
                html: "I will close in <b></b> milliseconds.",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });
        } catch (e) {
            console.error("Error adding document: ", e);
            Swal.fire({
                position: "top-end",
                icon: "Error",
                title: "Error",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }


    return (
        <div>
            <h1> FIREBASE CRUD OPERATION</h1>

            <div>
                <form className='form' onSubmit={savePost}>
                    <textarea
                        typeof='text'
                        className='postInput'
                        required
                        minLength={3}
                        maxLength={400}
                        placeholder="What is your mind"
                        onChange={(e) => {
                            setPostText(e.target.value)
                            // console.log(e.target.value)
                        }}
                    >
                    </textarea>
                    <br />
                    <Button
                        type='submit'
                        sx={{ "marginLeft": '1em', }}
                        variant="contained"
                    >Get Post</Button>
                </form>
            </div>


            <div>
                {(isLoading) ? "Loading..." : ""}

                posts.map(




            </div>

        </div>
    )
}

export default Posts

// <button type='submit'>Get Posts</button>

