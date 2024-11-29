import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "../pages/Main/Main";
import Login from "../pages/Login/Login";
import Menu from "./Menu";
import Dashboard from "../pages/Dashboard/Dashboard";
import PassengerDetails from "../pages/Passenger Details/PassengerDetails";
import CarDetails from "../pages/Car Details/CarDetails";
import ShowPassengerDetails from "../pages/Passenger Details/ShowPassengerDetails";


const Routing = () => {

    const PrivateRoute = ({ element }) => {
        return localStorage.getItem('token') ? element : <Navigate to='/login' />
    }

    return (
        <Routes>
            {Menu.map((e, index) => (
                <Route
                    key={index}
                    path={e.route}
                    element={<PrivateRoute element={<Main><e.component /></Main>} />}
                />
            ))}
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/passengerDetails" element={<PassengerDetails />} />
            <Route path="/CarDetails" element={<CarDetails />} />
            <Route path="/showPassengerDetails" element={<ShowPassengerDetails/>} />
        </Routes>
    );
};

export default Routing;
