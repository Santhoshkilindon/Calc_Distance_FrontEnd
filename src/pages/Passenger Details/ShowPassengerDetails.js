import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tab, TablePagination, Tabs, TextField, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../URL/URL";
import Edit from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import * as XLSX from 'xlsx';

const ShowPassengerDetails = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false); 
  const [passengerData, setPassengerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentPassenger, setCurrentPassenger] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState('one');
  const [statusValue, setStatusValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  // const [dateValue, setDateValue] = useState();

  const handleEdit = (passenger) => {
    setCurrentPassenger(passenger);
    setOpen(true);
  };

  const handleView = (passenger) => {
    setCurrentPassenger(passenger);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false); 
    setViewOpen(false);
    setCurrentPassenger(null);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/passengers/${currentPassenger._id}`,{ status: currentPassenger?.status } );
      if (response.status === 200) {
        console.log("Passenger status updated successfully");
        const token = localStorage.getItem('authToken');
        const statusFilter = value === "one" ? "Booked" : undefined;

        const updatedResponse = await axios.get(`${BASE_URL}/passenger`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage, 
            limit: 10, 
            status: statusFilter         
          },
        });
        setPassengerData(updatedResponse?.data?.data?.passengers);      
      } else {
        console.error("Failed to update passenger status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      if(error?.response?.data?.message){
        navigate("/login");
      }
      console.error("Error updating passenger status:", error);
    }
    setOpen(false); 
  };

  const handleChange = (field, value) => {
    setCurrentPassenger({ ...currentPassenger, [field]: value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleValueChange = (event) => {
    console.log('e',event); 
    setStatusValue(event.target.value);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleDownloadClick = () => {
    if (startDate && endDate) {
      getPassengerList();
      const formattedData = passengerData.map(item => ({
        ...item, 
      }));

      // const csvData = convertToCSV(formattedData);

      downloadExcelFile(formattedData, 'Passenger Details.xlsx');
      // downloadFile(csvData, 'Passenger Details.csv');
    }
  };

  const downloadExcelFile = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(field => row[field]).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadFile = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const getPassengerList = async (page = 1) => {
    console.log('startDate',startDate)
    console.log('endDate',endDate)
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error("Token not found, please login.");
        navigate("/login");
        return;
      }

      const statusFilter = value === "one" ? "Booked" : undefined;
      // let startDate = null;
      // let endDate = null;
      // if (selectedMonth) {
      //   startDate = new Date(selectedMonth);
      //   startDate.setDate(1); 

      //   endDate = new Date(selectedMonth);
      //   endDate.setMonth(endDate.getMonth() + 1); 
      //   endDate.setDate(0); 
      // }
      // let startDate = null;
      // let endDate = null;
      // if (dateValue && dateValue[0] && dateValue[1]) {
      //   startDate = dateValue[0].format('YYYY-MM-DD'); 
      //   endDate = dateValue[1].format('YYYY-MM-DD');  
      // }
      const response = await axios.get(`${BASE_URL}/passenger`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page, 
          limit: 10,  
          status: statusFilter, 
          startDate: startDate,
          endDate: endDate
        },
      });
      
      const { passengers, totalPages } = response?.data?.data;
      setPassengerData(passengers); 
      setTotalPages(totalPages); 

    } catch (error) {
      if (error?.response?.data?.message === "Session Expired. Log in again") {
        toast.error(error?.response?.data?.message);
        navigate("/login");
      }
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPassengerList(currentPage);
  }, [currentPage, value, startDate, endDate]);

  const filteredPassengers = passengerData?.filter((passenger) =>{
    return (
      passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.phone.includes(searchTerm) || 
      passenger.drop.toLowerCase().includes(searchTerm.toLowerCase()) || 
      passenger.pickup.toLowerCase().includes(searchTerm.toLowerCase()) || 
      passenger.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  );

  const paginatedPassengers = (filteredPassengers || passengerData || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // const passengersList = value === 'one' 
  //   ? paginatedPassengers.filter((passenger) => passenger.status.toLowerCase() === 'booked')
  //   : paginatedPassengers;

  // const passengers = passengersList.slice(skip, skip + limit);
  //   console.log('passengersList',passengersList)

  return(
    <>
    <Box>
    <Box sx={{ backgroundColor: '#00796b', padding: '24px 16px', borderRadius: '0 0 8px 8px' }}>
        <Typography variant="h4" color="white" textAlign="center" fontWeight="bold">
          Welcome to Admin Portal
        </Typography>
        <Typography variant="body1" color="white" textAlign="center" marginTop={1}>
          Manage and view your booked and all passengers.
        </Typography>
      </Box>
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
     <Typography sx={{fontSize: 18, marginLeft:2}}>
        Booking Details
     </Typography> 
    <Box display="flex">
    <Tabs
       value={value}
       onChange={handleTabChange}
       textColor="primary"
       indicatorColor="primary"
       sx={{
        maxHeight: '1px', 
        marginTop: 2
      }}
      >
      <Tab style={{ fontSize: '0.8rem' }} value="one" label="Booked Passengers" />
      <Tab style={{ fontSize: '0.8rem' }} value="two" label="All Passengers" />
    </Tabs>
    <Grid display="flex" sx={{marginLeft:20}}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid item marginRight={2}>
    <DatePicker
      label="Start Date"
      value={startDate}
      onChange={(newValue) => setStartDate(newValue)}
    />
    </Grid>
    <DatePicker
     label="End Date"
     value={endDate}
     onChange={(newValue) => setEndDate(newValue)}
    />
    </LocalizationProvider>
      </Grid>
      <Button
          variant="contained"
          onClick={handleDownloadClick}
          style={{
           width: "150px",
           height: "55px",
           fontSize: "14px",
           backgroundColor: "#00796b",
           color: "#fff",
           textTransform: "capitalize",
           marginLeft:15,
        }}
        >
          Download
        </Button>
    <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width:'15%',
          padding: '17px',
          marginBottom: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginLeft:15,
        }}
      />
      </Box>
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
        <TableCell><Typography variant="body1">S.no</Typography></TableCell>
          <TableCell><Typography variant="body1">Name</Typography></TableCell>
          <TableCell><Typography variant="body1">Email</Typography></TableCell>
          <TableCell><Typography variant="body1">Phone</Typography></TableCell>
          <TableCell><Typography variant="body1">Pick-up</Typography></TableCell>
          <TableCell><Typography variant="body1">Drop</Typography></TableCell>
          <TableCell><Typography variant="body1">Status</Typography></TableCell>
          <TableCell><Typography variant="body1">Action</Typography></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
       {paginatedPassengers?.length > 0 ? (
      paginatedPassengers?.map((passenger, index) => (
          <TableRow key={passenger._id}>
            <TableCell>{index+1}</TableCell>
            <TableCell>{passenger.name}</TableCell>
            <TableCell>{passenger.email}</TableCell>
            <TableCell>{passenger.phone}</TableCell>
            <TableCell>{passenger.pickup}</TableCell>
            <TableCell>{passenger.drop}</TableCell>
            <TableCell sx={{ color: passenger.status.toLowerCase() === 'confirmed-assigned' ? 'green' : 
                       passenger.status.toLowerCase() === 'booked' ? (theme) => theme.palette.primary.main : 'red' }}>
            {passenger.status}
            </TableCell>            
            <TableCell sx={{display:'flex'}}>
              <IconButton onClick={() => handleEdit(passenger)}> 
               <Edit/>
             </IconButton>
              <IconButton onClick={() => handleView(passenger)}> 
               <VisibilityIcon />
             </IconButton>
            </TableCell>
          </TableRow>
        ))
      ) : (
         <TableRow>
           <TableCell colSpan={12} align="center">
              <Typography color="#666">
                No Data
              </Typography>
           </TableCell>
         </TableRow>
      )} 
      </TableBody>
    </Table>
    <TablePagination
        rowsPerPageOptions={[5, 10, 25]} 
        component="div"
        count={(filteredPassengers || passengerData || [])?.length} 
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
  </TableContainer>
    </Box>
    </Box>
  <Dialog open={open} onClose={handleClose} >
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent>
      <FormControl  variant="standard"
      sx={{
       width: 250, 
      }}>
      <InputLabel id="trip-type-label">Select Status</InputLabel>
        <Select
          labelId="trip-type-label"
          value={currentPassenger?.status || ""}
          onChange={(e) => handleChange("status", e?.target?.value)}
        >
         <MenuItem value="Confirmed-Assigned" style={{ fontSize: "15px" }}>
           Confirmed-Assigned
         </MenuItem>
         <MenuItem value="Confirmed-UnAssigned" style={{ fontSize: "15px" }}>
           Confirmed-UnAssigned
         </MenuItem>
      </Select>
      </FormControl>
          {/* <TextField
            label="Status"
            value={currentPassenger?.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            fullWidth
            margin="normal"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewOpen} onClose={handleClose} PaperProps={{
      style: {
        minWidth: '600px',
        maxWidth: '600px',
        borderRadius: '10px',  
      },
    }}>
      <DialogTitle sx={{ color: '#00796b', textAlign: 'center' }}>
        Passenger Details
      </DialogTitle>
      <DialogContent 
         sx={{ 
            padding: '20px', 
            backgroundColor: '#f7f7f7', 
            alignSelf:'center', 
            width:'80%',
           }}>
        {[
          { label: "Name", value: currentPassenger?.name },
          { label: "Email", value: currentPassenger?.email },
          { label: "Phone", value: currentPassenger?.phone },
          { label: "Pick-up", value: currentPassenger?.pickup },
          { label: "Drop", value: currentPassenger?.drop },
          { label: "Status", value: currentPassenger?.status },
          { label: "Journey Date", value: dayjs(currentPassenger?.date).format("DD MMM YYYY") },
          ...(currentPassenger?.returnDate
            ? [{ label: "Return Date", value: dayjs(currentPassenger?.returnDate?.$d).format("DD MMM YYYY") }]
            : []),
          { label: "Requested", value: dayjs(currentPassenger?.requestedAt).format('DD MMM YYYY h:mm A') },
          { label: "Passenger", value: currentPassenger?.passenger },
          { label: "Luggage", value: currentPassenger?.luggage },
          { label: "Car Type", value: currentPassenger?.carType },
          { label: "Distance", value: currentPassenger?.distance },
          { label: "Total Fare", value: `₹ ${currentPassenger?.totalFare}` },
        ].map(({ label, value }) => (
          <div style={{ display: 'flex', marginTop: '12px' }} key={label}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '120px', color: '#333' }}>
              {label}:
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              {value || 'N/A'} 
            </Typography>
          </div>
        ))}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '10px' }}>
        <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#00796b', '&:hover': { backgroundColor: '#00796b' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </>
  )
}
 export default ShowPassengerDetails;