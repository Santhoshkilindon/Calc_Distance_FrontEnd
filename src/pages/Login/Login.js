import { Typography, Card, CardContent, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Drawer, List, ListItem, ListItemButton, ListItemIcon, Divider, ListItemText } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../URL/URL";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ShowPassengerDetails from "../Passenger Details/ShowPassengerDetails";
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email:'',
    password: ''
  });
  const [passengerData, setPassengerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const initialCarDetails = {
    carType: '',
    carName: '',
    price: '',
  };
  const [carDetails, setCarDetails] = useState(initialCarDetails);
  const [activeScreen, setActiveScreen] = useState('DashBoard');
  const [loading, setLoading] = useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpenSideBar(newOpen);
  };

  // const handleChange = (e) => {
  //   console.log('e',e.target)
  //   const { name, value } = e.target;
  //   setCarDetails({ ...carDetails, [name]: value });
  // };

  const handleChange = (e) => {
    console.log('e',e.target)
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if(name === "email"){
      setEmailError(null)
    } else if(name === "password"){
      setPasswordError(null)
    }
  };

  const handleLogin = async () =>{
    let isValid = true;
    setEmailError('');
    setPasswordError('');
  
    if (!data.email) {
      setEmailError('Email is required');
      isValid = false;
    }
  
    if (!data.password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (isValid) {
      setLoading(true);
    try{
     const response = await axios.post(`${BASE_URL}/login`, data)
     setLoading(false);
     if(response.status === 200){
       const token = response?.data?.token
       localStorage.setItem('authToken', token);
       console.log('token',token)
       toast.success("Login Successfull !");
       navigate('/showPassengerDetails')
      }
    }catch(err){
      if (err.response && err.response.status === 401) {
       toast.error("Invalid credentials");
     }
    }
  }
  }
  
  const handleCarDetails = async () => {
    console.log('carDetails', carDetails)
    const response = await axios.post(`${BASE_URL}/carDetails`,carDetails);
    const data = response.data;
    if(data){
      toast.success("Added successfully!");
      setOpen(false);
    }
    console.log('carDetailsdata', data)
  }

  const handleNavigation = (text) => {
    setActiveScreen(text);
    // if (text === 'Dashboard') {
    //   // navigate('/dashboard');
    // } else if (text === 'Passenger Details') {
    //   // navigate('/showPassengerDetails');
    // } else if (text === 'Add Car Detail') {
    //   setOpen(true);
    //   // navigate('/addCarDetail');
    // }
  };

  // const renderContent = () => {
  //   switch (activeScreen) {
  //     case 'Passenger Details':
  //       return <ShowPassengerDetails passengerData={passengerData} />;
  //     case 'Dashboard':
  //       return <Typography sx={{ marginTop: 3 }}>Dashboard Content</Typography>;
  //     case 'Add Car Detail':
  //       return <Typography sx={{ marginTop: 3 }}>Add Car Details Content</Typography>;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <>
<Grid container spacing={2} flexDirection="column" mt={5} mx={5}>
  <Typography mx={2}>Admin Login</Typography>
  <Grid item xs={12} sm={6}> 
    <TextField 
       sx={{ width: '50%' }}
       name="email"
       placeholder="Enter Your Email"
       value={data?.email}
       onChange={(e) => handleChange(e) }
       required
       error={!!emailError} 
       helperText={emailError}
    />
  </Grid>
  <Grid item xs={12} sm={6}> 
    <TextField 
       sx={{ width: '50%' }} 
       name="password"
       placeholder="Enter Your Password"
       value={data?.password} 
       onChange={ handleChange }
       required
       error={!!passwordError} 
       helperText={passwordError}
    />
  </Grid>
  <Grid item>
  <Button
    variant="contained"
    onClick={handleLogin}
    sx={{
      width: '15%',
      height: 40,
    }}
  >
    <Typography sx={{marginRight:1}}>Login</Typography>
    {loading && <CircularProgress color="#fff" size="13px"/> }
  </Button>   
  </Grid>
</Grid>
    {/* <Drawer open={openSideBar}>
    <Grid display="flex">
    <Box sx={{ width: 250, backgroundColor:'#59c5ff', height:'200%' }} role="presentation" >
    <Divider sx={{ marginTop:3}}/>
    <Typography sx={{textAlign:'center', marginTop:3, fontSize:20}}>Admin Login</Typography>  
    <Divider sx={{ marginTop:3}}/>
      <List>
        {['Dashboard', 'Passenger Details', 'Add Car Detail'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(text)}>
              <ListItemIcon>
               {text === "Dashboard" ? <DashboardIcon/> : text === "Passenger Details" ? <LibraryBooksIcon/> : <AddToPhotosIcon/> }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    <Box sx={{ marginLeft: '3%',marginTop:'6%'}}>
      {renderContent()}
    </Box>
    </Grid>  
    </Drawer> */}
    <div>
      {/* <Typography variant="h5" gutterBottom>
        Admin Login
      </Typography> */}
      {/* <Box display="flex">
      <Typography variant="h5" gutterBottom>
        Passenger Details:
      </Typography>

      <Button variant="contained" color="primary" style={{ marginLeft: "20px" }} 
         onClick={() => {
           setCarDetails(initialCarDetails)
           setOpen(true)
        }}
      >
        Add Car Details
      </Button>
      </Box> */}
{/* 
<TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h6">Name</Typography></TableCell>
            <TableCell><Typography variant="h6">Email</Typography></TableCell>
            <TableCell><Typography variant="h6">Phone</Typography></TableCell>
            <TableCell><Typography variant="h6">Pick-up</Typography></TableCell>
            <TableCell><Typography variant="h6">Drop</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passengerData.map((passenger) => (
            <TableRow key={passenger._id}>
              <TableCell>{passenger.name}</TableCell>
              <TableCell>{passenger.email}</TableCell>
              <TableCell>{passenger.phone}</TableCell>
              <TableCell>{passenger.pickup}</TableCell>
              <TableCell>{passenger.drop}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> */}
      <Grid container spacing={3} xs={12} md={10}>
        {/* {passengerData.map((passenger) => (
          <Grid item xs={12} sm={6} md={4} key={passenger._id}>
            <Card>
              <CardContent>
                <Box>
                  <Typography>Name : {passenger.name}</Typography>
                  <Typography>Email: {passenger.email}</Typography>
                  <Typography>Phone: {passenger.phone}</Typography>
                  <Typography>Pick-up: {passenger.pickup}</Typography>
                  <Typography>Drop: {passenger.drop}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))} */}
{/* 
         <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Car Details</DialogTitle>
        <DialogContent>
           <TextField
            autoFocus
            name="carType"
            label="Car Type"
            type="text"
            fullWidth
            value={carDetails.carType}
            onChange={handleChange}
            sx={{
              mt:1
            }}
          />
          <TextField
            margin="dense"
            name="carName"
            label="Car Name"
            type="text"
            fullWidth
            value={carDetails.carName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={carDetails.price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCarDetails}color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog> */}
      </Grid>
    </div>
    </>
  );
};

export default Login;
