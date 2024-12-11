import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tab, TablePagination, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useMediaQuery, useTheme } from '@mui/material';
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
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLocation } from "react-router-dom";

const ShowPassengerDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm' || 'xs'));
  const location = useLocation();
  const adminName = location?.state?.adminName;
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
  const [filterStatus, setFilterStatus] = useState('');
  const [logoutOpen, setLogoutOpen] = useState('');

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

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem('authToken');
    navigate('/login');
  }

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

      const statusFilter = value === "one" ? "Booked" : filterStatus === "All" ? undefined : filterStatus;
      // const filterStatus = filterStatus;
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
      console.log("passengers",passengers)
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
  }, [currentPage, value, startDate, endDate, filterStatus]);

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
<Box sx={{ backgroundColor: '#2C3E50', padding: '15px 5px' }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h6" color="#F39C12" fontWeight="bold" marginLeft={2}>
            Welcome to Admin Portal
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={6}
          sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              padding: 1,
              borderRadius: '8px',
            }}
          >
            <AccountCircleRoundedIcon sx={{ color: '#fff', fontSize: 25 }} />
            <Typography
              variant="caption"
              color="white"
              fontSize={13}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {adminName}
            </Typography>
            <Tooltip title="Logout" arrow>
              <LogoutOutlinedIcon
                onClick={() => setLogoutOpen(true)}
                sx={{
                  color: '#fff',
                  fontSize: 28,
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#ff4d4f',
                  },
                }}
              />
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
  <Typography
    sx={{
      fontSize: { xs: 16, sm: 18 },
      marginLeft: { xs: 0, sm: 2 },
      textAlign: { xs: 'center', sm: 'left' },
    }}
  >
    Booking Details
  </Typography>

  <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
    <Grid item xs={12} md={3.1}>
      <Tabs
        value={value}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
      >
        <Tab
          style={{
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
          value="one"
          label="Booked Passengers"
        />
        <Tab
          style={{
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
          value="two"
          label="All Passengers"
        />
      </Tabs>
    </Grid>

    <Grid item xs={12} sm={3} md={2} sx={{
    marginLeft: value === "one" ? { md: 27 } : 0
  }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '80%',
          padding: '18px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </Grid>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid item xs={12} sm={3} md={2}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          sx={{ width: '100%' }}
        />
      </Grid>

      <Grid item xs={12} sm={3} md={2}>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          sx={{ width: '100%' }}
        />
      </Grid>
    </LocalizationProvider>

    <Grid item xs={12} sm={2} md={1}>
      <Button
        variant="contained"
        onClick={handleDownloadClick}
        sx={{
          width: '100%',
          backgroundColor: '#F39C12',
          color: '#2C3E50',
          textTransform: 'capitalize',
          height: 50,
        }}
      >
        Download
      </Button>
    </Grid>

    {value === 'two' && (
      <Grid item xs={12} sm={3} md={1.9}>
        <FormControl size="small" sx={{ width: '100%' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
            sx={{
              height:50,
              fontSize:'14px'
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Confirmed-Assigned">Confirmed Assigned</MenuItem>
            <MenuItem value="Confirmed-UnAssigned">Confirmed UnAssigned</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    )}
  </Grid>

  <TableContainer component={Paper} sx={{ marginTop: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>S.no</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Pick-up</TableCell>
          <TableCell>Drop</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedPassengers?.length > 0 ? (
          paginatedPassengers?.map((passenger, index) => (
            <TableRow key={passenger._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{passenger.name}</TableCell>
              <TableCell>{passenger.email}</TableCell>
              <TableCell>{passenger.phone}</TableCell>
              <TableCell>{passenger.pickup}</TableCell>
              <TableCell>{passenger.drop}</TableCell>
              <TableCell
                sx={{
                  color:
                    passenger.status.toLowerCase() === 'confirmed-assigned'
                      ? 'green'
                      : passenger.status.toLowerCase() === 'booked'
                      ? (theme) => theme.palette.primary.main
                      : 'red',
                }}
              >
                {passenger.status}
              </TableCell>
              <TableCell sx={{ display: 'flex', gap: 1, alignItems: 'center', verticalAlign: 'middle' }}>
                <IconButton onClick={() => handleEdit(passenger)}   sx={{
                   padding: { xs: 0, sm: 1 }, 
                }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleView(passenger)}   sx={{
                    padding: { xs: 4, sm: 1 }, 
                }}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={12} align="center">
              <Typography color="#666">No Data</Typography>
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
    <Dialog open={logoutOpen} onClose={()=> setLogoutOpen(false)} >
        <DialogContent>
          <Typography>Are you sure want to exit ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setLogoutOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} variant="contained" color="primary">
            logout
          </Button>
        </DialogActions>
      </Dialog>
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
        minWidth: isSmallScreen ? '90%':'600px',
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