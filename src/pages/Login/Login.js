import { Typography, Card, CardContent, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Drawer, List, ListItem, ListItemButton, ListItemIcon, Divider, ListItemText, Grow, Fade, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../URL/URL";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import loginBackground from '../../assets/images/loginBackground.png';
import loginLogo from '../../assets/images/loginLogo.png';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email:'',
    password: ''
  });
  const [passengerData, setPassengerData] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [open, setOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(true);
  const [checked, setChecked] = useState(false);
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

  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
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
     console.log(response)
     if(response.status === 200){
       const token = response?.data?.user?.token
       const adminName = response?.data?.user?.userName
       setAdminName(adminName);
       localStorage.setItem('authToken', token);
       console.log('adminName',adminName)
       toast.success("Login Successfull !");
       navigate('/showPassengerDetails',{
         state: {
           adminName: adminName 
         }
       })
      }
    }catch(err){
      setLoading(false);
      console.log('err', err)
      if (err.response && err.response.data.message === "Invalid Credentials") {
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

  return (
    <>
<Box
  sx={{
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // background: 'linear-gradient(to right, #e0ecce, #00796b)',
    backgroundImage: `url(${loginBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <Grow in={true} timeout={1000}>
    <Grid
      container
      sx={{
        maxWidth: { xs: '90%', sm: 500 }, 
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
      flexDirection="column"
    >
      <Typography
        variant="h6"
        sx={{
          marginLeft: { xs: '1%', sm: 1 }, 
          fontFamily: '"Lato", sans-serif',
          fontWeight: 400,
          fontSize:'16px',
          alignSelf: "center"
        }}
      >
        Login
      </Typography>
      <Box sx={{
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center',
        gap:0.5,
        mt:1
        }}>
      <img 
         src={loginLogo} 
         alt="loginLogo" 
         width='15%'
      />
      <Typography sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        color: '#858585'
      }}>
        SINGLE
      </Typography>
      <Typography sx={{
        color:'#FFBF26',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600
      }}>
        RIDE
      </Typography>
      </Box>
      {/* <Grid item xs={12}> */}
        <TextField
          name="email"
          placeholder="Email*"
          value={data?.email}
          onChange={(e) => handleChange(e)}
          required
          error={!!emailError}
          helperText={emailError}
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: 1,
            width:"100%",
            marginTop:5,
            alignSelf: "center"
          }}
        />
      {/* </Grid> */}
      {/* <Grid item xs={12}> */}
        <TextField
          type={checked ? "text" : "password"}
          name="password"
          placeholder="Enter Password*"
          value={data?.password}
          onChange={handleChange}
          required
          error={!!passwordError}
          helperText={passwordError}
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: 1,
            width:"100%",
            marginTop:2,
            alignSelf: "center"
          }}
        />
        <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Checkbox
          checked={checked}
          onChange={handleCheckedChange}
          name="checkbox1"
          sx={{
            color: '#FFBF26',
            marginLeft:-1,
            '&.Mui-checked': {
              color: '#FFBF26', 
            },
            '& .MuiSvgIcon-root': {
              fontSize: 22, 
            },
          }}
        />

        <Typography 
          sx={{
           fontFamily: '"Lato", sans-serif',
           fontWeight: 400,
           fontSize:'12px',
        }}>
          Show Password
        </Typography>
        </Box>
      {/* </Grid> */}
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{
            height: 45,
            backgroundColor: '#FFBF26',
            color: '#fff',
            width: '100%',
            mt:2,
            alignSelf: "center"         
            // '&:hover': {
            //   backgroundColor: '#1565c0',
            //   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            // },
          }}
        >
          <Typography sx={{
            fontSize: '14px',
            fontFamily: '"Lato", sans-serif',
            fontWeight: 500,
          }}>Login</Typography>
          {loading && (
            <Fade in={loading}>
              <CircularProgress size="16px" sx={{ color: '#fff', marginLeft: 1 }} />
            </Fade>
          )}
        </Button>
    </Grid>
  </Grow>
</Box>


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
        </>
  );
};

export default Login;
