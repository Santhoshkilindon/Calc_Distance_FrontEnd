import {
  Button,
  Grid,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import sedan from "../../assets/images/sedan.png";
import suv from "../../assets/images/suv.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../URL/URL";

const CarDetails = ({ duration, distance, tollCount, startLocation, endLocation, selectedDate, passenger, luggage, returnDate}) => {
  const navigate = useNavigate();

  const getCarDetails = (passenger) => [
    {
      type: 'Sedan',
      condition: passenger <= 4 ,
      image: sedan,
      title: "Tatvamasi cabs",
      description: "Dzire or Etios or similar vehicle",
      priceMultiplier: 10,
    },
    {
      type: 'Economy SUV',
      condition: (passenger > 4) ,
      image: suv,
      title:'Tatvamasi cabs',
      description: 'Xylo or Innova or similar vehicle',
      priceMultiplier: 12,
    }
  ];

  useEffect(() => {
    const getCarDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/carDetails`);
        const data = response.data;

        if (data && data.carDetails) {
          console.log("car Details fetched successfully:", data.carDetails);
          // setPassengerData(data.passengers); 
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    getCarDetails();
  }, []);

  const renderCarDetails = (car, distance, navigate, startLocation, endLocation) => (
    <Grid container direction="column" spacing={1} mt={1} key={car.type}>
      <Grid container direction="row">
        <Grid item mx={1.5}>
          <img
            src={car.image}
            alt={car.type}
            style={{
              height: 70,
              width: 130,
              margin: 20,
            }}
          />
        </Grid>
        <Grid item mt={3}>
          <Typography sx={{ fontSize: 12 }}>{car.title}</Typography>
          <Typography sx={{ fontSize: 10 }}>{car.description}</Typography>
        </Grid>
        <Grid
          item
          mx={3}
          mt={3}
          sx={{
            backgroundColor: "#000",
            width: 70,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}
          >
            ₹{parseFloat(distance) * car.priceMultiplier}
          </Typography>
        </Grid>
        <Typography variant="caption" sx={{ color: "#000", fontSize: 12, marginTop: 3.5 }}>
          Driver Charges
        </Typography>
        <Grid
          item
          mx={3}
          mt={3}
          sx={{
            backgroundColor: "#000",
            width: 70,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}
          >
            500
          </Typography>
        </Grid>
        <Grid item mx={3} mt={3}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              const calculatedPrice = isNaN(parseFloat(distance)) ? 0 : parseFloat(distance) * car.priceMultiplier;
              navigate("/passengerDetails", {
                state: {
                  carDetails: {
                    title: car.description,
                    type: car.type,
                    distance: distance,
                    price: calculatedPrice,
                    driverCharges: 500, 
                    startLocation: startLocation,
                    endLocation: endLocation,
                    selectedDate: selectedDate,
                    returnDate: returnDate,
                    passenger: passenger,
                    luggage: luggage,
                  },
                },
              });
            }}           
            sx={{
              width: 80,
              height: 30,
            }}
          >
            <Typography variant="body2" fontSize={10}>
              Select
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
  
  return (
    <Box mt={2} mx={2} alignItems="center">
      <Paper
        sx={{
          height: 100,
          width: 350,
          borderRadius: 1,
          mt: "2%",
        }}
      >
        <Box>
          <Grid container direction="row" spacing={3} justifyContent="center">
            <Grid item>
              <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                <Typography variant="caption" fontSize={14}>
                  Distance
                </Typography>
                <Typography variant="caption" fontSize={12} fontWeight={"bold"}>
                  {distance}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                <Typography variant="caption" fontSize={14}>
                  Estimated Time
                </Typography>
                <Typography variant="caption" fontSize={12} fontWeight={"bold"}>
                  {duration}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                <Typography variant="caption" fontSize={14}>
                  Total Toll
                </Typography>
                <Typography variant="caption" fontSize={12} fontWeight={"bold"}>
                  {tollCount}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Box mt={1} mx={1}>
        <Grid container direction="column">
          <Typography variant="caption" fontWeight="bold" fontSize={14} mx={1.5}>
            Filters
          </Typography>
          <Typography variant="caption" fontWeight="bold" fontSize={12} mt={1} mx={1.5}>
            Taxi Type
          </Typography>
        </Grid>

        {/* <Box sx={{ display: "flex", width: "35%", mt: 1, marginLeft: -18}}>
          <Grid container direction="row" spacing={1} justifyContent="center">
            {['sedan', 'economySuv'].map((type) => (
              <Grid item key={type}>
                <Button
                  variant="outlined"
                  size="small"
                >
                  <Typography variant="body2" fontSize={10}>
                    {type === 'sedan' ? 'Sedan' : 'Economy SUV'}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box> */}
      </Box>

      {getCarDetails(passenger)
        .filter((car) => car.condition)
        .map((car) => renderCarDetails(car, distance, navigate, startLocation, endLocation))}
    </Box>
  );
};

export default CarDetails;
