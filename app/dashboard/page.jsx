"use client";

import { Box, Paper, Typography, Button, Modal, TextField, Grid } from "@mui/material";
import Search from '../Search.js';
import { useSearchParams } from 'next/navigation';
import { auth, firestore } from "@/firebase";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SidebarDemo } from '../_components/SidebarM.jsx';
import Link from 'next/link';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: 'linear-gradient(to right, #e6f0ff, #b3d9ff)',
  border: '2px solid #000',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  overflow: 'hidden',
};

export default function Home() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    if (userId) {
      updateInventory();
    }
  }, [userId]);

  const updateInventory = async () => {
    if (!firestore || !userId) return;
    try {
      const q = query(collection(firestore, `inventory-${userId}`));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs
        .filter((doc) => doc.id !== 'initial')
        .map((doc) => doc.data());
      setInventory(items);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  const handleAddItem = async () => {
    if (!firestore || !userId) return;
    try {
      const docRef = doc(collection(firestore, `inventory-${userId}`), newItemName.toLowerCase());
      const docCheck = await getDoc(docRef);
      if (docCheck.exists()) {
        const { count } = docCheck.data();
        await setDoc(docRef, {
          name: newItemName,
          count: count + 1
        });
      } else {
        await setDoc(docRef, {
          name: newItemName,
          count: 1
        });
      }
      setNewItemName('');
      handleClose();
      updateInventory();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleRemoveItem = async (name) => {
    if (!firestore || !userId) return;
    try {
      const docRef = doc(collection(firestore, `inventory-${userId}`), name.toLowerCase());
      const docCheck = await getDoc(docRef);
      if (docCheck.exists()) {
        const { count } = docCheck.data();
        if (count > 1) {
          await setDoc(docRef, { name, count: count - 1 });
        } else {
          await deleteDoc(docRef);
        }
        updateInventory();
      }
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex flex-col items-center justify-center">
        <Typography variant="h4" className="text-blue-900 mb-6">
          Please sign in to view your inventory
        </Typography>
        <Link href="/sign-in" passHref>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4575f3',
              '&:hover': {
                backgroundColor: '#3a63cc',
              },
              padding: '10px 20px',
              fontSize: '1rem',
            }}
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // if (!userId) {
  //   return (
  //   <div className="min-h-screen bg-blue-100 flex items-center justify-center">
  //     Please sign in to view your inventory.
  //     <div className="mt-4 text-center">
  //         <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 transition duration-200">
  //           <button className="w-full bg-gray-200 text-blue-600 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200">
  //             Sign-in
  //           </button>
  //         </Link>
  //       </div>
  //   </div>
  //   );
  // }

  return (
        <SidebarDemo>
        <Box sx={{background: 'linear-gradient(to right, #e6f0ff, #b3d9ff)', 
          minHeight: '100vh', 
          width: '100vw', 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'}}>
          <Typography variant="h2" textAlign="center" mb={4} color={'#4575f3'} fontWeight={"bold"}>InventTrack</Typography>
          <Search />
          {searchParams.get('query') && (<Typography variant="body2" sx={{ mb: 2 }}>
            Showing results for: &quot;{searchParams.get('query')}&quot;
            </Typography>
          )}
          <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1200px', width: '100%' }}>
            {/* Add Item Button Column */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Button 
                variant="contained" 
                onClick={handleOpen}
                sx={{width: '200px', 
                  height: '50px',
                  backgroundColor: '#4575f3',
                  '&:hover': {
                    backgroundColor: '#3a63cc',
                  }}}  // Fixed size for the button
              >
                Add Item
              </Button>
            </Grid>
    
            {/* Inventory List Column */}
            <Grid item xs={12} md={9}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: "70vh",
                overflowY: "auto",
                border: '1px solid ',
                borderRadius: '16px',
                padding: 2,
                backgroundColor: 'white'
              }}>
                {inventory.map((item) => (
                  <Paper 
                    key={item.name} 
                    elevation={2} 
                    variant='outlined' 
                    square={false} 
                    sx={{ 
                      padding: 2, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <Typography>
                      {item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : 'No name'}
                    </Typography>
                    <Typography>
                      Quantity: {item.count || 0}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleRemoveItem(item.name)}
                      size="small"
                      sx={{
                        border: '1px solid',
                        '&:hover': {
                          border: '1px solid',
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
    
          <Modal 
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ '& .MuiBackdrop-root': { borderRadius: '16px' } }}
          >
            <Box sx={{
              ...style,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item to Inventory
              </Typography>
              <TextField
                label="Item Name"
                variant="outlined"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                fullWidth
              />
              <Button 
                variant="contained" 
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
              >
                Add Item
              </Button>
              </Box>
            </Modal>
          </Box>
          </SidebarDemo>
      );
}
