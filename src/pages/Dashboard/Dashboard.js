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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import CarDetails from "../Car Details/CarDetails";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () => {
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
  const [selectedDate, setSelectedDate] = useState(null);
  const minTime = dayjs().add(30, 'minutes');
  const [selectedTime, setSelectedTime] = useState(minTime.format('hh:mm A'));
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [input, setInput] = useState('');
  const [carType, setCarType] = useState(''); 
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState('one-way');
  const [errorMessage, setErrorMessage] = useState('');  
  const [locationError, setLocationError] = useState("");

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

  const handlePlaceChanged = async () => {
    const startPlace = startLocation?.getPlace();
    const endPlace = endLocation?.getPlace();
    console.log('startPlace',startPlace?.vicinity)
    console.log('endPlace',endPlace?.vicinity)
    setStartLocationRef(startPlace?.vicinity || ''); 
    setEndLocationRef(endPlace?.vicinity|| '');
    if (startPlace && endPlace) {
      const origin = startPlace?.geometry?.location;
      const destination = endPlace?.geometry?.location;
      try {
        const distanceResponse = await axios.get(
          `http://localhost:3000/get-distance?origins=${origin.lat()},${origin.lng()}&destinations=${destination.lat()},${destination.lng()}`
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
      currentTime = currentTime.minute(59).second(0); 
    }
  
    for (let i = 0; i < 24; i++) {
      times.push(currentTime.format('hh:mm A'));
      currentTime = currentTime.add(30, 'minutes');
    }
  
    return times;
  };

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

console.log('selectedDate',selectedDate )  

const handleTripTypeChange = (event) => {
  setTripType(event.target.value);
  if (event.target.value === 'one-way') {
    setReturnDate(null);
  }
};

const handleGetTaxiClick = () => {
  if (!startLocation || !endLocation) {
    setLocationError("Please select both starting and ending locations.");
    return; 
  }
  setLocationError(""); 
  setShowDistance(true); 
};

console.log('startLocation', startLocation)
console.log('endLocation', endLocation)

  return (
    <>
<div
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
  <Autocomplete onLoad={handleLoadStart} onPlaceChanged={handlePlaceChanged}>
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

  <Autocomplete onLoad={handleLoadEnd} onPlaceChanged={handlePlaceChanged}>
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
        format="DD/MM/YYYY"
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
</div>

      {/* <Button
          variant={"outlined"}
          onClick={handleOpen}
          sx={{
            height: 10,
            fontSize: 7,
            marginLeft:'89%'
          }}
        >
          Admin
        </Button> */}
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
        {showDistance && (
          <CarDetails
            duration={duration} 
            distance={distance} 
            tollCount={tollCount} 
            startLocation={startLocationRef}
            endLocation={endLocationRef}
            selectedDate={selectedDate}
            passenger={passenger}
            luggage={luggage}
            {...(returnDate ? { returnDate } : {})}
          />
        )}
        
      </Box>
    </>
  );
};

export default Dashboard;