import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../URL/URL";

const PassengerDetails = () => {
  const location = useLocation();
  const { carDetails } = location.state || {};
  console.log("carDetails", carDetails);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState();
  const [dropLocation, setDropLocation] = useState();
  const [formatteDate, setFormatteDate] = useState('')
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    drop: "",
    status: "Booked",
    carType: carDetails?.type,
    date : dayjs(carDetails?.selectedDate?.$d).format("DD MMM YYYY"),
    totalFare: carDetails?.price,
    distance : carDetails?.distance
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoadStart = (autocomplete) => {
    setStartLocation(autocomplete);
  };

  const handleLoadEnd = (autocomplete) => {
    setEndLocation(autocomplete);
  };

  const handlePlaceChanged = async () => {
    const startPlace = startLocation?.getPlace();
    const endPlace = endLocation?.getPlace();
    setPassengerDetails((prevState) => {
      const updatedDetails = { ...prevState };
      if (startPlace) {
        updatedDetails.pickup = startPlace.formatted_address;
      }
    
      if (endPlace) {
        updatedDetails.drop = endPlace.formatted_address;
      }
      return updatedDetails;
      });    
    //   setDropLocation(endPlace?.formatted_address)
    if (startPlace && endPlace) {
      const origin = startPlace.geometry.location;
      const destination = endPlace.geometry.location;

      try {
        const response = await axios.get(
          `${BASE_URL}/get-distance?origins=${origin.lat()},${origin.lng()}&destinations=${destination.lat()},${destination.lng()}`
        );
        const responseData = response.data;
      } catch (error) {
        console.error("Error fetching distance:", error);
      }
    } else {
      console.log("Place not selected");
    }
  };

  const handleSubmit = async () => {
    try {
        const timeNow = dayjs().toISOString();
        const passengerDetailsWithTime = {
          ...passengerDetails, 
          passenger: carDetails?.passenger,
          luggage: carDetails?.luggage,  
          returnDate: dayjs(carDetails?.returnDate?.$d).format("DD MMM YYYY"),
          requestedAt: timeNow,  
        };        
        console.log('passengerDetailsWithTime',passengerDetailsWithTime)
        const response = await axios.post(`${BASE_URL}/passenger`, passengerDetailsWithTime);
        const data = response.data;      
      if (data) {
        console.log("Passenger details submitted successfully:", data);
        toast.success("Cab booked successfully!");
        setPassengerDetails({
          name: "",
          phone: "",
          email: "",
          pickup: "",
          drop: "",
          status: "Booked",
          carType: carDetails?.type,
          date: dayjs(carDetails?.selectedDate?.$d).format("DD MMM YYYY"),
          totalFare: carDetails?.price,
          distance: carDetails?.distance,
        });
      } else {
        console.error("Error submitting passenger details:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    if (carDetails?.selectedDate?.$d) {
      const dateObj = carDetails?.selectedDate?.$d
      const formattedDate = dayjs(dateObj).format("DD MMM YYYY");
      setFormatteDate(formattedDate);
    }
  }, [carDetails]);

  return (
    <Box sx={{ padding: 5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 6,
              padding: 4,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2, color:'Green' }}>
              Contact and Pickup Details
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Name", name: "name", type: "text", label1: "Enter Your Name" },
                { label: "Phone Number", name: "phone", type: "text", label1: "Enter Your Phone Number"  },
                { label: "Email", name: "email", type: "email", label1: "Enter Your Email"},
              ].map((field) => (
                <Grid
                  item
                  xs={12}
                  key={field.name}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body2" sx={{ width: "150px" }}>
                    {field.label}
                  </Typography>
                  <TextField
                    name={field.name}
                    label={field.label1}
                    value={passengerDetails[field.name]}
                    onChange={handleChange}
                    variant="standard"
                    type={field.type}
                    sx={{
                        width:'70%',             
                        '& .MuiInputLabel-root': {
                           fontSize: '13px', 
                        },
                    }}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ width: "150px" }}>
                  Pick Up
                </Typography>
                <Autocomplete onLoad={handleLoadStart} onPlaceChanged={handlePlaceChanged}>
                  <TextField
                    name="pickup"
                    value={passengerDetails?.pickup}
                    onChange={handleChange}
                    variant="standard"
                    sx={{
                        width:'255%',
                        '& .MuiInputLabel-root': {
                            fontSize: '11px', 
                         },
                    }}
                  />
                </Autocomplete>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ width: "150px" }}>
                  Drop
                </Typography>
                <Autocomplete onLoad={handleLoadEnd} onPlaceChanged={handlePlaceChanged}>
                  <TextField
                    name="drop"
                    value={passengerDetails?.drop}
                    onChange={handleChange}
                    variant="standard"
                    sx={{
                        width:'255%',
                    }}
                  />
                </Autocomplete>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Proceed
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 6,
              padding: 3,
              height: "65%",
              width: '100%'
            }}
          >
            <Typography sx={{ textAlign: "center", marginBottom: 2, fontSize:15,  color:'Green' }}>
              Your Booking Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                  Itinerary:
                </Typography>
                <Typography sx={{fontSize:14 }}>
                  {`${carDetails?.startLocation || "N/A"} > ${
                    carDetails?.endLocation || "N/A"
                  }`}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                  Pick Up Date:
                </Typography>
                <Typography sx={{fontSize:14 }}>
                    {formatteDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                  Car Type:
                </Typography>
                <Typography sx={{fontSize:14 }}>{carDetails?.title || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                  Passenger
                </Typography>
                <Typography sx={{  fontSize:14 }}>
                  {carDetails?.passenger|| "0"}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                   Luggage
                </Typography>
                <Typography sx={{ fontSize:14 }}>
                   {carDetails?.luggage|| "0"}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                  KMs Included:
                </Typography>
                <Typography sx={{fontSize:14 }}>{carDetails?.distance || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "120px", fontWeight: "bold", fontSize:14 }}>
                  Total Fare:
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize:14 }}>
                  ₹{carDetails?.price || "0"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PassengerDetails;