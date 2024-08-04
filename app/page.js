"use client";

import { Box, Paper, Typography, Button, Modal, TextField, Grid } from "@mui/material";
import Search from './Search.js';
import { useSearchParams } from 'next/navigation';
import { firestore } from "@/firebase";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f0f5ff',
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

  const handleAddItem = async () => {
    if (!firestore) return;
    try {
      const docRef = doc(collection(firestore, 'inventory'), newItemName.toLowerCase());
      const docCheck = await getDoc(docRef);
      if(docCheck.exists()){
        const {count} = docCheck.data();
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
    if (!firestore) return;
    try{
      const docRef = doc(collection(firestore, 'inventory'), name.toLowerCase());
      const docCheck = await getDoc(docRef);
      if(docCheck.exists()){
        const {count} = docCheck.data();
        if(count === 1){
          await deleteDoc(docRef)
        }else{
          await setDoc(docRef, {
            name: name,
            count: count-1
          });
        }
      } 
      await updateInventory();
    }catch(err){
      console.error("Error removing document: ", err);
    }
  }

  const updateInventory = async () => {
    if (!firestore) return;
    const q = query(collection(firestore, 'inventory'));
    const snapshot = await getDocs(q);
    let inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
  
    const searchQuery = searchParams.get('query')?.toLowerCase();
    if (searchQuery) {
      inventoryList = inventoryList.filter(item => 
        item.name.toLowerCase().includes(searchQuery)
      );
    }
  
    setInventory(inventoryList);
  };

  useEffect(() => {
    if (firestore) {
      updateInventory();
    }
  }, [searchParams]);
  return (
    <Box sx={{ bgcolor: '#f0f5ff', minHeight: '100vh', width: '100vw', padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h2" textAlign="center" mb={4} color={'#4575f3'} fontWeight={"bold"}>InventTrack</Typography>
      <Search />
      {searchParams.get('query') && (<Typography variant="body2" sx={{ mb: 2 }}>
        Showing results for: "{searchParams.get('query')}"
        </Typography>
      )}
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1200px', width: '100%' }}>
        {/* Add Item Button Column */}
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Button 
            variant="contained" 
            onClick={handleOpen}
            sx={{ width: '200px', height: '50px' }}  // Fixed size for the button
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
            padding: 2
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
  );
}