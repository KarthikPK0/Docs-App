import { Modal, Box, Button, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import DocCard from './DocCard';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const firebaseConfig = {
  apiKey: "AIzaSyDU51gN7K-txefXL78200mo5BOQUvO4UXE",
  authDomain: "docsapp-bff25.firebaseapp.com",
  projectId: "docsapp-bff25",
  storageBucket: "docsapp-bff25.appspot.com",
  messagingSenderId: "209226666925",
  appId: "1:209226666925:web:f48bfc5edf26bbdc6fc724",
  measurementId: "G-HTY0960V4X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Home = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [documents, setDocuments] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
  };

  const handleAddDocument = async () => {
    try {
      await addDoc(collection(db, 'documents'), { title, content: '' });
      fetchDocuments(); 
      handleClose();
      toast.success('Document added successfully!'); 
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Error adding document');  
    }
  };
  

  const handleDeleteDocument = async (docId) => { 
    try {
      await deleteDoc(doc(db, 'documents', docId));
      fetchDocuments(); 
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const fetchDocuments = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'documents'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docs);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
};


useEffect(() => {
  fetchDocuments(); 
}, []);

useEffect(() => {

  fetchDocuments();
}, [documents]);


  return (
    <>
      <div className='d-flex flex-column justify-content-center '>
        <h1 className="text-center mt-2">
          DOCS APP
        </h1>
        <div className='d-flex justify-content-center'>
          <Button variant="outlined" color="secondary" onClick={handleOpen}>
            + Add document
          </Button>
        </div>
        <div style={{ alignSelf: 'center' }} className="w-75 d-flex align-items-center p-2 mt-5  ">
          {documents.map(doc => (
            <DocCard key={doc.id} id={doc.id} title={doc.title} content={doc.content} onDelete={() => handleDeleteDocument(doc.id)} /> // Added content prop and onDelete prop
          ))}
        </div>
        <Modal className='d-flex justify-content-center align-items-center'
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box className="border p-3 shadow rounded d-flex justify-content-center flex-column bg-light w-25" >
            <div>
              <TextField className='w-100' id="outlined-basic" label="Enter the title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='text-center mt-3'>
              <Button onClick={handleAddDocument} variant="outlined" color="primary">
                Add
              </Button>
            </div>
          </Box>
        </Modal>
        <ToastContainer/>
      </div>
    </>
  );
}

export default Home;
