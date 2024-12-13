import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { Navigate, useNavigate } from "react-router-dom";
import loginLogo from '../../assets/images/loginLogo.png';
import phone from '../../assets/images/phone.png';
import taxiDashBoard from '../../assets/images/taxiDashboard.png';
import Search from '../../assets/images/search.png';
import price from '../../assets/images/price.png';
import drivers from '../../assets/images/drivers.png';
import convenience from '../../assets/images/convenience.png';
import punctuality from '../../assets/images/punctuality.png';
import oneWay from '../../assets/images/oneWay.png';
import roundTrip from '../../assets/images/roundTrip.png';
import taxi from '../../assets/images/taxi-5347451 1.png';
import darkTaxi from '../../assets/images/darkTaxi.png';
import copyRight from '../../assets/images/copyRight.png';
import { BASE_URL } from "../URL/URL";

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm' || 'xs'));

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [tollCount, setTollCount] = useState(null);
  const [showDistance, setShowDistance] = useState(false);
  const [passenger, setPassenger] = useState("");
  const [luggage, setLuggage] = useState("");
  const [startLocationRef, setStartLocationRef] = useState(false);
  const [endLocationRef, setEndLocationRef] = useState(false);
  const [premiumSuv, setPremiumSuv] = useState(false);
  const [economySuv, setEconomySuv] = useState(false);
  const [sedanCar, setSedanCar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [input, setInput] = useState('');
  const [carType, setCarType] = useState(''); 
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState('one-way');
  const [errorMessage, setErrorMessage] = useState('');  
  const [startLocationError, setStartLocationError] = useState("");
  const [endLocationError, setEndLocationError] = useState("");
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [returnPickerOpen, setReturnPickerOpen] = useState(false);
  const navigate = useNavigate();
  const today = dayjs();

  const handleLoadStart = (autocomplete) => {
    if (window?.google) {
      setStartLocation(autocomplete);
      console.log('autocomplete',autocomplete)
    } else {
      console.error("Google API not loaded");
    }
  };

  const handleLoadEnd = (autocomplete) => {
    if (window?.google) {
      setEndLocation(autocomplete);
    } else {
      console.error("Google API not loaded");
    }
  };

  const handlePlaceChanged = async (type) => {
    if (type === "start") {
      setStartLocationError("");
    } else if (type === "end") {
      setEndLocationError("");
    }
    const startPlace = startLocation?.getPlace();
    const endPlace = endLocation?.getPlace();
    setStartLocationRef(startPlace?.vicinity || ''); 
    setEndLocationRef(endPlace?.vicinity|| '');
    if (startPlace && endPlace) {
      const origin = startPlace?.geometry?.location;
      const destination = endPlace?.geometry?.location;
      try {
        const distanceResponse = await axios.get(
          `${BASE_URL}/get-distance?origins=${origin.lat()},${origin.lng()}&destinations=${destination.lat()},${destination.lng()}`
        );
        const responseData = distanceResponse.data;
        setDistance(responseData.distance);
        setDuration(responseData.duration);
        setTollCount(responseData.tollRoadCount);
      } catch (error) {
        console.error("Error fetching distance:", error);
      }
    } else {
      console.log("Place not selected");
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    let currentTime = dayjs()
  
    const minute = currentTime.minute();
    if (minute < 30) {
      currentTime = currentTime.minute(30).second(0); 
    } else {
      const time = currentTime.add(1, 'minute').minute(0).second(0);
      currentTime = time.add(60, 'minute').minute(0).second(0)
    }
  
    for (let i = 0; i < 24; i++) {
      times.push(currentTime.format('hh:mm A'));
      currentTime = currentTime.add(30, 'minutes');
    }
  
    return times;
  };
  const timeOptions = generateTimeOptions();
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);

  const handleOpen = () => {
    setIsVisible(false); 
  };

  const handleClose = () => {
    setIsVisible(false); 
  };

  const handleCarTypeChange = (event) => {
    setCarType(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); 
  };

  const handleChange = (event) => {
    setInput(event.target.value); 
  };

  const handleTaxiTypeChange = (type) => {
    setSedanCar(type === 'sedan');
    setEconomySuv(type === 'economySuv');
    setPremiumSuv(type === 'premiumSuv');
  }; 

const handleTripTypeChange = (event) => {
  setTripType(event.target.value);
  if (event.target.value === 'one-way') {
    setReturnDate(null);
  }
};

const handleTextFieldClick = () => {
  setPickerOpen(true);
};

const handleRetunDateClick = () => {
  // setPickerOpen(true);
  setReturnPickerOpen(true);
};

const handleGetTaxiClick = () => {
  if (!startLocation?.gm_accessors_?.place?.vt?.formattedPrediction) {
    setStartLocationError("Please select starting location");
    return; 
  } else if(!endLocation?.gm_accessors_?.place?.vt?.formattedPrediction){
    setEndLocationError("Please select ending location");
    return;
  }
  setStartLocationError(""); 
  setEndLocationError("");
  setShowDistance(true); 
  const taxiDetails = {
    duration,
    distance,
    tollCount,
    startLocation: startLocationRef,
    endLocation: endLocationRef,
    selectedDate,
    passenger,
    luggage,
    returnDate,  
  };
  navigate("/carDetails",{
    state: taxiDetails
  });
};

  return (
    <>
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
    <Grid container padding={2} mx={2} justifyContent="space-between" >
  <Grid 
    item 
    xs={5} 
    sm={6}   
    md={6}
    display="flex"
    justifyContent="flex-start"
    alignItems="center"
  >
    <img src={loginLogo} alt="loginLogo" 
    style={{
      height: window.innerWidth >= 900 ? 30 : 20
    }}
    />
    <Typography
      sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        fontSize:{md:'15px', xs:'13px'},
        color: '#858585',
        marginLeft: 1
      }}
    >
      SINGLE
    </Typography>
    <Typography
      sx={{
        color: '#FFBF26',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        marginLeft: 1,
        fontSize:{md:'15px', xs:'13px'},
      }}
    >
      RIDE
    </Typography>
  </Grid>

  <Grid 
    item 
    xs={7}  
    sm={6} 
    md={6}
    display="flex"
    alignItems="center"
    justifyContent="flex-end"
    >
    <Box
      sx={{
        display: 'flex',
        backgroundColor: '#EEEEEE',
        width: {md:'70px', xs:'60px'},
        height: '25px',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.7
      }}
    >
      <img src={phone} alt="phone" height={15} />
      <Typography
        sx={{
          fontFamily: '"Lato", sans-serif',
          fontWeight: 600,
          fontSize: {xs: '10px', lg: '16px'},
          color: '#000',
        }}
      >
        24 x 7
      </Typography>
    </Box>
    <Typography
      sx={{
        fontFamily: '"Lato", sans-serif',
        fontWeight: 600,
        fontSize: {xs: '12px', lg: '16px'},
        marginLeft: { xs: 1, lg:1.5},
        marginRight: { md:5, xs:2}
      }}
    >
      9025567654
    </Typography>
  </Grid>
    </Grid>
    <Box sx={{
    width: '100%',
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // background: 'linear-gradient(to right, #e0ecce, #00796b)',
    backgroundImage: `url(${taxiDashBoard})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    flexDirection: 'column'
  }}>
      <Typography sx={{
        color:'#fff',
        fontSize:{md:'76px', xs:'31px'},
        marginTop:{md:12, xs:1},
        marginBottom:{md:5, xs:5}
      }}>
         One Way Drop Taxi
      </Typography>
      <Grid 
  spacing={{xs:2, md:1}}
  mt={2}
  container 
  sx={{
    maxWidth: { xs: '90%', sm: 500, md: '95%' },
    paddingTop: '20px',
    paddingBottom: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 15,
    padding:{xs:'30px', md:'20px'},
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    justifyContent: "center",  
    alignSelf:"center",
    marginLeft:{xs:0.5}
  }}
>
  <Grid item xs={12} sm={3} md={1}>
    <FormControl variant="standard" style={{ minWidth: "100%"}}>
      <InputLabel>Trip Type</InputLabel>
      <Select 
        variant="standard" 
        value={tripType} 
        fullWidth
        onChange={handleTripTypeChange} 
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 100, overflowY: "auto" },
          },
        }}
      >
        <MenuItem value="one-way" style={{ fontSize: "13px" }}>One-Way</MenuItem>
        <MenuItem value="round-trip" style={{ fontSize: "13px" }}>Round Trip</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={3} md={2.5}>
    <Box>
      <Autocomplete onLoad={handleLoadStart} onPlaceChanged={() => handlePlaceChanged("start")}>
        <FormControl fullWidth>
          <TextField 
            id="standard-from" 
            variant="standard" 
            label="From"
            placeholder="Select PickUp Location"
            sx={{
              marginLeft:{md:2}
            }} 
          />
        </FormControl>
      </Autocomplete>
      {startLocationError && (
        <Typography sx={{ color: 'red', fontSize: 10 }}>
          {startLocationError}
        </Typography>
      )}
    </Box>
  </Grid>

  <Grid item xs={12} sm={3} md={2.5}>
    <Box>
      <Autocomplete onLoad={handleLoadEnd} onPlaceChanged={() => handlePlaceChanged("end")}>
        <TextField 
          id="standard-to" 
          label="To" 
          variant="standard" 
          fullWidth
          placeholder="Select Drop Location"
          sx={{
            marginLeft:{md:2},
          //   "& .MuiInput-underline:before": {
          //     borderBottom: "none", // Removes the bottom line (underline) on focus
          //   },
          //  "& .MuiInput-underline:after": {
          //    borderBottom: "none", // Removes the bottom line (underline) after focus
          //  }
          }}
        />
      </Autocomplete>
      {endLocationError && (
        <Typography sx={{ color: 'red', fontSize: 10 }}>
          {endLocationError}
        </Typography>
      )}
    </Box>
  </Grid>

  <Grid item xs={12} sm={3} md={2}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
        <TextField
          label="Pickup Date"
          variant="standard" 
          value={selectedDate ? selectedDate.format("DD/MM/YYYY") : ""}
          onClick={handleTextFieldClick} 
          readOnly 
          sx={{ width:{md:"50%", xs:'100%'}, marginLeft:{md:4} }}
        />
        {isPickerOpen && (
          <DatePicker
            open={isPickerOpen}
            onClose={() => setPickerOpen(false)}
            value={selectedDate}
            minDate={today}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setPickerOpen(false);
            }}
            renderInput={() => null}
            sx={{
              width: isPickerOpen ? '0px' : '0px', 
              height: isPickerOpen ? '0px' : '0px', 
              overflow: 'hidden', 
              opacity: isPickerOpen ? 1 : 0, 
            }}
          />
        )}
      </Grid>
    </LocalizationProvider>
  </Grid>

  <Grid item xs={12} sm={3} md={1}>
    <FormControl fullWidth variant="standard" sx={{marginLeft:{md:-7}}}>
      <InputLabel>Select Time</InputLabel>
      <Select
        variant="standard" 
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 250, overflowY: "auto" },
          },
        }}
      >
        {generateTimeOptions().map((time) => (
          <MenuItem key={time} value={time} style={{ fontSize: "13px" }}>
            {time}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>


  {tripType === "round-trip" && (
    <Grid item xs={12} sm={3} md={2}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
  <TextField
          label="Return Date"
          variant="standard" 
          value={returnDate ? returnDate.format("DD-MM-YYYY") : ""}
          onClick={handleRetunDateClick} 
          readOnly 
          sx={{ cursor: "pointer", width: {md:"60%", xs:'100%'} }}
        />
            <DatePicker
              open={returnPickerOpen}
              value={returnDate}
              onClose={() => setReturnPickerOpen(false)}
              onChange={(newValue) => setReturnDate(newValue)}
              renderInput={() => null}
              sx={{
                width: '0px', 
                height:  '0px', 
                overflow: 'hidden', 
                opacity:  0, 
              }}
            />
          </LocalizationProvider>
    </Grid>
  )}

  <Grid item xs={12} sm={3} md={1} display="flex" justifyContent="center" alignItems="center">
  <Button
    onClick={handleGetTaxiClick}
    style={{
    }}
  >
     {isSmallScreen && 
      <Box 
        sx={{
          backgroundColor:'#FFBF26',
          paddingRight:5,
          paddingLeft:5,
          paddingTop:1,
          paddingBottom:1,
          borderRadius:3
        }}
      >
        <Typography sx={{color:'#fff', fontSize:'14px'}}>
          Search
        </Typography>
      </Box>
     } 
     {!isSmallScreen &&
       <img src={Search} width={50} alt="search-icon" />
     }      
  </Button>
  </Grid>
  </Grid>
    </Box>
    <Box sx={{
    width:'100%'
  }}>
<Grid container alignItems="center" justifyContent="center" sx={{ px:{xs:'70px', md:'100px' } }}>
  <Grid item>
    <Typography sx={{
      textAlign: 'center',
      color: '#EEA800',
      fontFamily: '"Lato", sans-serif',
      fontWeight: 500,
      mt: {md:10,xs:5}
    }}>
      What sets us apart?
    </Typography>
    <Typography sx={{
      textAlign: 'center',
      color: '#000',
      fontFamily: '"Lato", sans-serif',
      fontWeight: 600,
      fontSize: {md:'32px', xs:'25px'},
      mt: 1,
      mb: {md:4, xs:3}
    }}>
      Simple choices, transparent pricing, reliable rides.
    </Typography>
  </Grid>
  
  <Grid container  mb={{md:5, xs:0}} spacing={4} justifyContent="center" >
    {[
      {
        img: price,
        title: 'Transparent Pricing',
        description: 'No hidden fees or surge surprises-know the cost upfront before you book.',
      },
      {
        img: drivers,
        title: 'Trusted Drivers',
        description: 'Carefully vetted drivers to ensure safety and a pleasant experience.',
      },
      {
        img: punctuality,
        title: 'Punctuality',
        description: "Our on-time promise means you’ll never be left waiting or running late.",
      },
      {
        img: convenience,
        title: 'Convenience',
        description: 'Book in seconds, ride in minutes. We’re ready when you are.',
      },
    ].map(({ img, title, description }, index) => (
      <Grid item xs={12} md={3} sm={6} key={index} >
        <Box display="flex" alignItems="center" justifyContent="center">
          <img src={img} alt={title} height={40} width={40} />
          <Typography sx={{
            color: '#000',
            fontFamily: '"Lato", sans-serif',
            fontWeight: 400,
            fontSize: '20px',
            ml: 1,
          }}>
            {title}
          </Typography>
        </Box>
        <Typography sx={{
          color: '#000',
          fontFamily: '"Lato", sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          textAlign:'center'
        }}>
          {description}
        </Typography>
      </Grid>
    ))}
  </Grid>
</Grid>

    </Box>
    <Box sx={{
      backgroundColor:'#F6F6F6',
      width:'100%',
      mt:10,
    }}>
<Grid 
  container 
  alignItems="center" 
  justifyContent="center" 
  sx={{ px: { xs: '10px', md: '100px' } }} 
  spacing={4} 
>
  <Grid item xs={12} md={4}>
    <Typography sx={{
      textAlign: { xs: 'center', md: 'left' },
      color: '#EEA800',
      fontFamily: '"Lato", sans-serif',
      fontWeight: 500,
    }}>
      Our services
    </Typography>
    <Typography sx={{
      textAlign: { xs: 'center', md: 'left' },
      color: '#000',
      fontFamily: '"Lato", sans-serif',
      fontWeight: 600,
      fontSize: { md: '32px', xs: '25px' },
      mt: 1,
      mb: {md:4, xs:0}
    }}>
      Simple, reliable ride for every journey—whether it’s one way or round trip, we’ve got you covered.
    </Typography>
  </Grid>

  {[
    {
      img: oneWay,
      title: 'One Way',
      description: 'Whether it’s a commute, a meeting, or an errand, our one-way service gets you there smoothly and on time. Enjoy the flexibility of booking a ride tailored to your schedule without worrying about a return plan.',
    },
    {
      img: roundTrip,
      title: 'Round Trip',
      description: 'Perfect for appointments, shopping, or day trips, our round-trip service ensures you have a ride back when you need it. With wait time options and guaranteed availability, your return journey is as stress-free as your departure.',
    },
  ].map(({ img, title, description }, index) => (
    <Grid 
      item 
      xs={12}
      md={4}  
      key={index} 
      display="flex" 
      flexDirection="column" 
      alignItems={{xs:'center',md:'flex-start'}}
      mb={{md:2, xs:1}}
    >
      <Box display="flex" flexDirection={{md:"column", xs:'row'}} mb={2} gap={{xs:1}}>
        <img src={img} alt={title} height={40} width={40} />
        <Typography sx={{
          color: '#000',
          fontFamily: '"Lato", sans-serif',
          fontWeight: 600,
          fontSize: {md:'32px', xs:'25px'},
        }}>
          {title}
        </Typography>
      </Box>
      <Typography sx={{
        color: '#000',
        fontFamily: '"Lato", sans-serif',
        fontWeight: 400,
        fontSize: '14px',
        textAlign: { xs: 'center', md: 'left' },
      }}>
        {description}
      </Typography>
    </Grid>
  ))}
</Grid>
    </Box>
    <Box sx={{
      width:'100%',
      mt:{xs:5, md:7},
    }}>
<Grid 
  container 
  alignItems="center" 
  sx={{ px: { xs: '20px', md: '70px' } }} 
  spacing={{ xs: 3, md: 10 }}
>
  <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
    <img src={taxi} height={260} width={440}/>
  </Grid>
    <Grid 
      item 
      xs={12} 
      md={8} 
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        textAlign: { xs: 'center', md: 'left' },
      }}    
      >
        <Typography sx={{
          color: '#EEA800',
          fontFamily: '"Lato", sans-serif',
          fontWeight: 500,
          fontSize: '20px',
        }}>
          Single Ride
        </Typography>
      <Typography sx={{
          color: '#000',
          fontFamily: '"Lato", sans-serif',
          fontWeight: 600,
          fontSize: {md:'32px',xs:'25px'},
        }}>
         India’s Premier Intercity and Local Taxi Service
      </Typography>
      <Typography sx={{
        color: '#000',
        fontFamily: '"Lato", sans-serif',
        fontWeight: 400,
        fontSize: '14px',
        // textAlign:'center'
        mt:4
      }}>
     We are Single Ride, a leading online cab booking platform offering reliable and premium intercity and local taxi services. With an extensive network across India, we’re proud to be your go-to choice for both intercity and local travel, providing comfort and convenience wherever you go
      </Typography>
      <Typography sx={{
        color: '#000',
        fontFamily: '"Lato", sans-serif',
        fontWeight: 400,
        fontSize: '14px',
        // textAlign:'center',
        mt:2
      }}>
        Your comfort and convenience are our priority. Whether you’re heading to a nearby town, planning a getaway, or exploring a new city, we’re here to make your journey effortless and enjoyable.      
     </Typography>
     <Typography sx={{
        color: '#000',
        fontFamily: '"Lato", sans-serif',
        fontWeight: 500,
        fontSize: '14px',
        fontStyle: 'italic',
        // textAlign:'center',
        mt:2
      }}>
       “Travel with ease—trust Single Ride to take you there.”     
     </Typography>
    </Grid>
</Grid>
    </Box>
    <Box
  sx={{
    width: '100%',
    mt: { xs: 7, md: 7 },
    backgroundColor: '#000',
    paddingBottom: 1.5,
    paddingLeft:{xs:2},
  }}
>
  <Grid
    container
    spacing={4}
    sx={{
      alignItems: 'center',
      justifyContent: { xs: 'center', md: 'flex-start', lg:'flex-start' }, 
      marginLeft: { md: 5 },
      textAlign: { xs: 'center', md: 'left' }, 
    }}
  >
    <Grid
      item
      xs={12}
      sm={4}
      md={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // textAlign: 'center', 
        // alignItems: 'center', // Center items on mobile
        paddingRight:{xs:2}
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          justifyContent: {xs:'center', md:'flex-start'}, 
        }}
      >
        <img
          src={darkTaxi}
          alt="Taxi Icon"
          style={{
            width: window.innerWidth >= 900 ? 70 : 50,
            height: window.innerWidth >= 900 ? 40 : 30,
          }}
        />
        <Typography
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: { md: '21px', xs: '18px' },
            color: '#858585',
          }}
        >
          SINGLE
        </Typography>
        <Typography
          sx={{
            color: '#FFBF26',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: { md: '21px', xs: '18px' },
          }}
        >
          RIDE
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: { md: '16px', xs: '14px' },
          color: '#fff',
          fontFamily: '"Lato", sans-serif',
          marginTop: 1,
        }}
      >
        Your journey, simplified. Reliable rides, wherever you go.
      </Typography>
    </Grid>

    <Grid
      item
      xs={12}
      sm={4}
      md={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: {xs:'center',md:'left'}, 
        gap: 0.5,
        paddingRight:{xs:2}
        // alignItems: {xs:'center'}, 
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { md: '20px', xs: '18px' },
          color: '#fff',
          fontFamily: '"Lato", sans-serif',
          ml:{md:10}
          // textAlign:{xs:'center', md:'left'}
        }}
      >
        Location
      </Typography>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: { md: '16px', xs: '14px' },
          color: '#fff',
          fontFamily: '"Lato", sans-serif',
          ml:{md:10}
        }}
      >
        No. 2/13-3 Sathyam Complex, Sri Sathyam Nagar, Thalakkudi, Trichy - 621216
      </Typography>
    </Grid>

    <Grid
      item
      xs={12}
      sm={4}
      md={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign:{xs:'center',md:'left'} , 
        alignItems:{xs:'center', md:'flex-start'} ,
        mt: -3,
        paddingRight:{xs:2}
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { md: '20px', xs: '18px' },
          color: '#fff',
          fontFamily: '"Lato", sans-serif',
          mb: 1,
          mt: { xs: 3, md:0 },
          ml:{md:12}
        }}
      >
        Get in Touch
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          ml:{md:12},
          // justifyContent: 'center', 
          // alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#333',
            width: { md: '70px', xs: '60px' },
            height: { md: '25px', xs: '20px' },
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.7,
          }}
        >
          <img
            src={phone}
            style={{
              height: window.innerWidth >= 900 ? 15 : 12,
            }}
            alt="Phone Icon"
          />
          <Typography
            sx={{
              fontFamily: '"Lato", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '9px', lg: '12px', md: '12px' },
              color: '#fff',
            }}
          >
            24 x 7
          </Typography>
        </Box>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { md: '16px', xs: '14px' },
            color: '#fff',
            fontFamily: '"Lato", sans-serif',
          }}
        >
          9363968686
        </Typography>
      </Box>
    </Grid>
  </Grid>

  <Grid mt={5} spacing={2} display="flex" justifyContent="center" alignItems="center">
    <img src={copyRight} height={12} />
    <Typography
      sx={{
        textAlign: 'center',
        color: '#fff',
        fontFamily: '"Lato", sans-serif',
        fontWeight: 500,
        fontSize:{md:'12px', xs:'10px'},
        ml: 1,
        paddingRight:{xs:2}
      }}
    >
      Copyright Single Ride
    </Typography>
  </Grid>
</Box>



    </Box>
  {/* <div
   style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "5px",
    padding: "15px 10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  }}
  >
  <Box>
  <Autocomplete onLoad={handleLoadStart} onPlaceChanged={() => handlePlaceChanged("start")}>
    <input
      type="text"
      placeholder="Select starting location"
      style={{
        margin: "5px",
        fontSize: "14px",
        padding: "12px 25px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        width: "220px",
      }}
    />
  </Autocomplete>
    {startLocationError && 
     <Typography sx={{color:'red', fontSize:10, marginLeft:1}}>
       {startLocationError}
     </Typography>
    }
  </Box>
  <Box>
  <Autocomplete onLoad={handleLoadEnd} onPlaceChanged={() => handlePlaceChanged("end")}>
    <input
      type="text"
      placeholder="Select ending location"
      style={{
        margin: "5px",
        fontSize: "14px",
        padding: "12px 20px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        width: "220px",
      }}
    />
  </Autocomplete>
     {endLocationError && 
       <Typography sx={{color:'red', fontSize:10, marginLeft:1}}>
        {endLocationError}
       </Typography>
     }
   </Box>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid display="flex" >
      <FormControl margin="normal" style={{ minWidth: "140px" }}>
        <InputLabel>Trip Type</InputLabel>
        <Select value={tripType} onChange={handleTripTypeChange} label="Trip Type"  
          MenuProps={{
            PaperProps: {
             style: { maxHeight: 200, overflowY: "auto" },
            },
          }}> 
          <MenuItem value="one-way" style={{ fontSize: "13px" }}>One-Way</MenuItem>
          <MenuItem value="round-trip" style={{ fontSize: "13px" }}>Round Trip</MenuItem>
        </Select>
      </FormControl>
      <Grid item marginLeft={1} mt={1.5}>
      <DatePicker
        label="Departure Date"
        minDate={today}
        value={selectedDate}
        format="DD-MM-YYYY"
        onChange={(newValue) => setSelectedDate(newValue)}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
      </Grid>
      <Grid item marginLeft={1} mt={1.5}>
      {tripType === "round-trip" && (
        <DatePicker
          label="Return Date"
          minDate={selectedDate || today}
          value={returnDate}
          format="DD/MM/YYYY"
          onChange={(newValue) => setReturnDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      )}
      </Grid>
    </Grid>
  </LocalizationProvider>
  <FormControl variant="outlined" style={{ minWidth: "140px" }}>
    <InputLabel>Select Time</InputLabel>
    <Select
      MenuProps={{
        PaperProps: {
          style: { maxHeight: 250, overflowY: "auto" },
        },
      }}
      value={selectedTime}
      onChange={(e) => setSelectedTime(e.target.value)}
      label="Select Time"
    >
      {generateTimeOptions().map((time) => (
        <MenuItem key={time} value={time} style={{ fontSize: "13px" }}>
          {time}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  <FormControl style={{ minWidth: "140px" }}>
    <InputLabel>Passenger</InputLabel>
    <Select
      MenuProps={{
        PaperProps: {
          style: { maxHeight: 250, overflowY: "auto" },
        },
      }}
      value={passenger}
      onChange={(e) => setPassenger(e.target.value)}
      label="Passenger"
    >
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <MenuItem key={num} value={num} style={{ fontSize: "13px" }}>
          {num}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  <FormControl style={{ minWidth: "140px" }}>
    <InputLabel>Luggage</InputLabel>
    <Select
      value={luggage}
      onChange={(e) => setLuggage(e.target.value)}
      label="Luggage"
    >
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <MenuItem key={num} value={num} style={{ fontSize: "13px" }}>
          {num}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  <Button
    variant="contained"
    onClick={handleGetTaxiClick}
    style={{
      width: "150px",
      height: "45px",
      fontSize: "14px",
      backgroundColor: "#007bff",
      color: "#fff",
      textTransform: "capitalize",
    }}
  >
    Get Taxi
  </Button>
</div> */}
        {isVisible && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '80%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 2,
            boxShadow: 3,
          }}
        >
          <IconButton onClick={handleClose} sx={{marginLeft:'85%' }}>
            <CloseIcon fontSize="small"/>
          </IconButton>
          <Grid container display="flex" direction='column'>
          <Grid item>  
          <Typography variant="caption" fontSize={8}>Driver Charge</Typography>
          <TextField
            sx={{
              width: '100px',
              height: '50px', 
              marginLeft:'5px',
              input: {
                fontSize: '10px',
                padding: '5px',  
              },
              label: {
                fontSize: '14px', 
              }
            }}
            value={inputValue} 
            onChange={handleInputChange}
            variant="outlined"
          />       
          </Grid>
          <Grid item>
          {/* <Typography variant="caption" fontSize={8}>Car Rent</Typography>
            */}
          <FormControl sx={{ marginLeft: '10px', width: '150px' }}>
        <InputLabel id="car-type-label" sx={{ fontSize: '14px' }}>Car Type</InputLabel>
        <Select
          labelId="car-type-label"
          id="car-type"
          value={carType}
          label="Car Type"
          onChange={handleCarTypeChange}
          sx={{
            fontSize: '12px',
            height: '50px',
            '& .MuiSelect-select': {
              fontSize: '12px',
              padding: '10px',
            },
          }}
        >
          <MenuItem value="Sedan">Sedan</MenuItem>
          <MenuItem value="Economic SUV">Economic Suv</MenuItem>
          <MenuItem value="Premium SUV">Premium SUV</MenuItem>
        </Select>
        {/* Optional helper text */}
        {/* <FormHelperText sx={{ fontSize: '10px' }}>Select car type</FormHelperText> */}
      </FormControl>
      <TextField
        placeholder="Car rent"
          sx={{
            width: '100px',
            height: '50px', 
            marginLeft:'5px',
            input: {
              fontSize: '10px',
              padding: '5px',  
            },
            label: {
              fontSize: '14px', 
            }
          }}
            value={input} 
            onChange={handleChange}
            variant="outlined"
          /> 
          </Grid>
          </Grid>
        </Box>
      )}
      <Box>
      </Box>
    </>
  );
};

export default Dashboard;