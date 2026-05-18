import { createBrowserRouter } from "react-router";
import Home from "../Home/Home";
import MainLayout from "../MainLayout/MainLayout";
import Coverage from "../Coverage/Coverage";
import Services from "../Services/Services";
import AboutUs from "../AboutUs/AboutUs";
import AuthLayout from "../MainLayout/AuthLayout";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register"; 
import SendPercel from "../SendPercel/SendPercel";
import PercelConfirm from "../ParcelConfirm/ParcelConfirm";  
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../../Dashboard/DashboardLayout"; 
import Settings from "../../Dashboard/Settings";
import Overview from "../../Dashboard/Overview";
import AllPercel from "../../Dashboard/AllPercel";
import Tracking from "../../Dashboard/Tracking";
import ParcelDetails from "../../Dashboard/ParcelDetails";
import EditParcel from "../../Dashboard/EditParcel";
import Payment from "../../Dashboard/Payment/Payment";
import PaymentSuccess from "../../Dashboard/Payment/PaymentSuccess";
import PaymentCancel from "../../Dashboard/Payment/PaymentCancel";
import PaymentHistory from "../../Dashboard/Payment/PaymentHistory"; 
import RiderForm from "../RiderForm/RiderForm";
import PrivateRoute from "../Auth/PrivateRoute/PrivateRoute";
import RiderApplications from "../../Dashboard/RiderApplications"; 
import UserManagement from "../../Dashboard/AllUser/UserManagement";
import AdminRoute from "./AdminRoute";
import AssignRider from "../../Dashboard/AssignRider/AssignRider";
import RiderDashboardLayout from "../../RiderDashboardLayout/RiderDashboardLayout";
import AdminDashboardLayout from "../../AdminDashboardLayout/AdminDashboardLayout";
import AdminOverview from "../../AdminDashboardLayout/AdminOverview";


// Add error handling for fetch requests
const fetchWithErrorHandling = async (url, fallbackData = []) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return fallbackData;
  }
};
  

const servicesPromise = fetchWithErrorHandling("/services.json", []);
 

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
        {
            index: true,
            element: <Home></Home>,
        },
        {
          path: "/coverage", 
          element: <Coverage></Coverage>,
          loader: async () => {
          const res = await fetch("/serviceCenters.json");
          return res.json();
          },
        }, 
        {
          path: "/services", 
          element: <Services servicesPromise={servicesPromise}></Services>, 
        }, 
        {
          path: "/about",
          element: <AboutUs></AboutUs>,
        },
        {
          path: "/parcel-confirm",
          element: <PercelConfirm></PercelConfirm>,
        },
        {
          path: "/rider",
          element: (
            <PrivateRoute>
              <RiderForm></RiderForm>,
            </PrivateRoute>
          )
        },
        {
          path: "/send-percel",
          element: (
            <PrivateRoute>
              <SendPercel></SendPercel>,
            </PrivateRoute>
          ),
          loader: async () => {
          const res = await fetch("/serviceCenters.json");
          return res.json();
          },
        },
        {
          path: "/parcels/:id",
          element: <ParcelDetails />,
        },
        {
            path: "/parcels/edit/:id",
            element: <EditParcel />,
        },
        {
          path: "/pricing", 
          element: <div className="max-w-6xl mx-auto px-4 py-12"><h1 className='font-bold text-2xl'>Pricing Page Coming Soon!</h1></div>,
        }, 
        {
          path: "/blog", 
          element: <div className="max-w-6xl mx-auto px-4 py-12"><h1 className='font-bold text-2xl'>Blog Page Coming Soon!</h1></div>,
        }, 
        { 
          path: "/contact",
          element: <div className="max-w-6xl mx-auto px-4 py-12"><h1 className='font-bold text-2xl'>Contact Page Coming Soon!</h1></div>,
        }, 
        { 
          path: "/profile",
          element: <div className="max-w-6xl mx-auto px-4 py-12"><h1 className='font-bold text-2xl'>Profile Page Coming Soon!</h1></div>,
        }
    ]
  },
  {
    path: "/", 
    Component: AuthLayout, 
    children: [
      {
        path: "/login", 
        element: <Login></Login>,
      }, 
      {
        path: "/register", 
        element: <Register></Register>,
      }
    ]
  }, 
  // User Dashboard
  {
    path: "/dashboard",
    element: <ProtectedRoute></ProtectedRoute>,
    children: [
            {
                element: <DashboardLayout></DashboardLayout>  ,
                children: [
                    { index: true, element: <Overview /> },
                    { index: "dashboard", element: <Overview /> },
                    { path: "parcels", element: <AllPercel /> },
                    { path: "settings", element: <Settings /> },
                    { path: "tracking", element: <Tracking /> },
                    { path: "payment/:parcelId", element: <Payment /> }, 
                    { path: "payment-success", element: <PaymentSuccess /> }, 
                    { path: "payment-cancelled", element: <PaymentCancel /> }, 
                    { path: "payment-history", element: <PaymentHistory  /> }, 
                    { path: "rider-applications", element: <RiderApplications /> },
                    // { path: "users-management", element: <AdminRoute> <UserManagement></UserManagement>  </AdminRoute> },
                    { path: "users-management", element:   <UserManagement></UserManagement> },
                    
                ],
            },
            // {
            //   path: "/payment/:percelId",
            //   element: <Payment />,
            // }
        ],
  },
  // Rider Dashboard Route: 
  {
    path: "/rider-dashboard",
    element: <ProtectedRoute></ProtectedRoute>,
    children: [
            {
                element: <RiderDashboardLayout></RiderDashboardLayout>  ,
                children: [
                    { index: true, element: <RiderApplications /> },  
                    // { path: "assign-riders", element:   <AssignRider></AssignRider> },
                ],
            }, 
        ],
  }, 
  // Admin Dashboard: 
  {
    path: "/admin-dashboard",
    element: <ProtectedRoute></ProtectedRoute>,
    children: [
            {
                element:  <AdminDashboardLayout></AdminDashboardLayout>,
                children: [
                    { index: true, element:  <AdminOverview></AdminOverview> },
                    // { index: "admin-dashboard", element: <AdminOverview></AdminOverview> },
                ],
            }, 
        ],
  }
]);
