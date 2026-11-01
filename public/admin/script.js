
document.addEventListener("DOMContentLoaded", function () {
    // Mobile sidebar
    const sidebar = document.getElementById("adminSidebar");
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const closeBtn = document.getElementById("sidebarCloseBtn");
    const overlay = document.getElementById("adminSidebarOverlay");

    function openSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.add("sidebar-open");
        overlay.classList.add("overlay-visible");

        if (toggleBtn) {
            toggleBtn.setAttribute("aria-expanded", "true");
        }
    }

    function closeSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.remove("sidebar-open");
        overlay.classList.remove("overlay-visible");

        if (toggleBtn) {
            toggleBtn.setAttribute("aria-expanded", "false");
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            if (sidebar && sidebar.classList.contains("sidebar-open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    // Highlight the current sidebar link
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

    document.querySelectorAll(".admin-nav-link").forEach(function (link) {
        const linkPath = new URL(link.href, window.location.origin)
            .pathname.replace(/\/+$/, "") || "/";

        if (linkPath === currentPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    // ========================================
    // KISANSETU - ENGLISH / MARATHI LANGUAGE
    // ========================================

    const languageOptions = document.querySelectorAll(".lang-option");
    const currentLanguageLabel = document.getElementById("current-lang");

    const translations = {
        en: {
            "Dashboard": "Dashboard",
            "Statistics": "Statistics",
            "Manage Farmers": "Manage Farmers",
            "Manage Buyers": "Manage Buyers",
            "Verify KYC": "Verify KYC",
            "Manage Categories": "Manage Categories",
            "Approve Products": "Approve Products",
            "Manage Orders": "Manage Orders",
            "Manage Enquiries": "Manage Enquiries",
            "Manage Complaints": "Manage Complaints",
            "Manage Banners": "Manage Banners",
            "Manage Districts / Talukas": "Manage Districts / Talukas",
            "Sales and User Reports": "Sales and User Reports",
            "Admin Profile": "Admin Profile",
            "Settings": "Settings",
            "English": "English",
            "Search": "Search",
            "Search farmers...": "Search farmers...",
            "Search buyers...": "Search buyers...",
            "Search name, application ID or mobile...":
                "Search name, application ID or mobile...",
            "Total Applications": "Total Applications",
            "Pending Review": "Pending Review",
            "Verified": "Verified",
            "Rejected": "Rejected",
            "KYC Applications": "KYC Applications",
            "All Statuses": "All Statuses",
            "All Documents": "All Documents",
            "Pending": "Pending",
            "Reset": "Reset",
            "Export Applications": "Export Applications",
            "Farmer Details": "Farmer Details",
            "Document Type": "Document Type",
            "Submitted On": "Submitted On",
            "Actions": "Actions",
            "No applications found": "No applications found",
            "Review the submitted documents carefully before approving an application.":
                "Review the submitted documents carefully before approving an application.",
            "ADMIN PANEL": "ADMIN PANEL",
            "MAIN MENU": "MAIN MENU",
            "USER MANAGEMENT": "USER MANAGEMENT",
            "MARKETPLACE": "MARKETPLACE",
            "PLATFORM SETTINGS": "PLATFORM SETTINGS",
            "ACCOUNT": "ACCOUNT",
            "Dashboard": "Dashboard",
            "Statistics": "Statistics",
            "Manage Farmers": "Manage Farmers",
            "Manage Buyers": "Manage Buyers",
            "Verify KYC": "Verify KYC",
            "Manage Categories": "Manage Categories",
            "Approve Products": "Approve Products",
            "Manage Orders": "Manage Orders",
            "Manage Enquiries": "Manage Enquiries",
            "Manage Complaints": "Manage Complaints",
            "Manage Banners": "Manage Banners",
            "Manage Districts / Talukas": "Manage Districts / Talukas",
            "Sales & User Reports": "Sales & User Reports",
            "Admin Profile": "Admin Profile",
            "Settings": "Settings",
            "Admin Workspace": "Admin Workspace",
            "Manage KisanSetu securely": "Manage KisanSetu securely",
            "Welcome to your KisanSetu workspace": "Welcome to your KisanSetu workspace",
            "Notifications": "Notifications",
            "KYC verification": "KYC verification",
            "Review pending farmer documents.": "Review pending farmer documents.",
            "Product approvals": "Product approvals",
            "Check products awaiting review.": "Check products awaiting review.",
            "Complaints": "Complaints",
            "Review unresolved complaints.": "Review unresolved complaints.",
            "Administrator": "Administrator",
            "System Admin": "System Admin",
            "Sign Out": "Sign Out",
            "Marketplace Statistics": "Marketplace Statistics",
            "Monitor users, products, orders and marketplace performance.": "Monitor users, products, orders and marketplace performance.",
            "Refresh Statistics": "Refresh Statistics",
            "Farmers": "Farmers",
            "Registered farmers": "Registered farmers",
            "View Farmers": "View Farmers",
            "Buyers": "Buyers",
            "Registered buyers": "Registered buyers",
            "View Buyers": "View Buyers",
            "Products": "Products",
            "Listed marketplace products": "Listed marketplace products",
            "View Products": "View Products",
            "Orders": "Orders",
            "Total marketplace orders": "Total marketplace orders",
            "View Orders": "View Orders",
            "Pending KYC": "Pending KYC",
            "Review documents": "Review documents",
            "Pending Products": "Pending Products",
            "Review products": "Review products",
            "Open Complaints": "Open Complaints",
            "Review complaints": "Review complaints",
            "User Distribution": "User Distribution",
            "Farmers compared with buyers": "Farmers compared with buyers",
            "User registration overview": "User registration overview",
            "Marketplace Overview": "Marketplace Overview",
            "Product approval and order status": "Product approval and order status",
            "Current marketplace summary": "Current marketplace summary",
            "Quick Reports": "Quick Reports",
            "Access important marketplace records": "Access important marketplace records",
            "Sales and User Reports": "Sales and User Reports",
            "Review sales and registration data": "Review sales and registration data",
            "Order Reports": "Order Reports",
            "Review marketplace transactions": "Review marketplace transactions",
            "Location Management": "Location Management",
            "Manage districts and talukas": "Manage districts and talukas",
            "Statistics Summary": "Statistics Summary",
            "Overview of the platform": "Overview of the platform",
            "Marketplace Users": "Marketplace Users",
            "Approved Products": "Approved Products",
            "Completed Orders": "Completed Orders",
            "Report Generated": "Report Generated",
            "Statistics will display live database figures after the admin statistics API is connected.": "Statistics will display live database figures after the admin statistics API is connected.",
            "Manage Buyers": "Manage Buyers",
            "View and manage buyer accounts registered on KisanSetu.": "View and manage buyer accounts registered on KisanSetu.",
            "Export Buyers": "Export Buyers",
            "Total Buyers": "Total Buyers",
            "Registered accounts": "Registered accounts",
            "Active Buyers": "Active Buyers",
            "Currently active": "Currently active",
            "Pending Verification": "Pending Verification",
            "Awaiting verification": "Awaiting verification",
            "Suspended Buyers": "Suspended Buyers",
            "Accounts suspended": "Accounts suspended",
            "Buyer Directory": "Buyer Directory",
            "Review buyer details and account status.": "Review buyer details and account status.",
            "sample records": "sample records",
            "Search by name, email or mobile...": "Search by name, email or mobile...",
            "All Statuses": "All Statuses",
            "Active": "Active",
            "Pending": "Pending",
            "Suspended": "Suspended",
            "Reset": "Reset",
            "Buyer": "Buyer",
            "Mobile Number": "Mobile Number",
            "Registered On": "Registered On",
            "Total Orders": "Total Orders",
            "Status": "Status",
            "Actions": "Actions",
            "View buyer": "View buyer",
            "Edit buyer": "Edit buyer",
            "No buyers found": "No buyers found",
            "Try changing your search or status filter.": "Try changing your search or status filter.",
            "Showing 1–8 of 8 sample records": "Showing 1–8 of 8 sample records",
            "Buyer Details": "Buyer Details",
            "Buyer account information": "Buyer account information",
            "Email": "Email",
            "Mobile": "Mobile",
            "Close": "Close",
            "Previous page": "Previous page",
            "Next page": "Next page",
            "Manage Farmers": "Manage Farmers",
            "Manage farmer accounts and monitor their marketplace activity.": "Manage farmer accounts and monitor their marketplace activity.",
            "Export Farmers": "Export Farmers",
            "Total Farmers": "Total Farmers",
            "Registered farmer accounts": "Registered farmer accounts",
            "Active Farmers": "Active Farmers",
            "Currently active": "Currently active",
            "Pending KYC": "Pending KYC",
            "Verification required": "Verification required",
            "Suspended Farmers": "Suspended Farmers",
            "Accounts suspended": "Accounts suspended",
            "Farmer Directory": "Farmer Directory",
            "Review farmer profiles, locations, KYC status and activity.": "Review farmer profiles, locations, KYC status and activity.",
            "sample records": "sample records",
            "Search by name, email, mobile or village...": "Search by name, email, mobile or village...",
            "All Account Statuses": "All Account Statuses",
            "All KYC Statuses": "All KYC Statuses",
            "Active": "Active",
            "Pending": "Pending",
            "Suspended": "Suspended",
            "Verified": "Verified",
            "Rejected": "Rejected",
            "Reset": "Reset",
            "Farmer": "Farmer",
            "Mobile Number": "Mobile Number",
            "Village / District": "Village / District",
            "Farm Size": "Farm Size",
            "KYC Status": "KYC Status",
            "Account Status": "Account Status",
            "Actions": "Actions",
            "No farmers found": "No farmers found",
            "Try changing your search or filters.": "Try changing your search or filters.",
            "Showing 1–8 of 8 sample records": "Showing 1–8 of 8 sample records",
            "Farmer Details": "Farmer Details",
            "Farmer account information": "Farmer account information",
            "Email": "Email",
            "Mobile": "Mobile",
            "Location": "Location",
            "Close": "Close",
            "Verify KYC": "Verify KYC",
            "Review farmer identity documents and manage KYC verification applications.": "Review farmer identity documents and manage KYC verification applications.",
            "Export Applications": "Export Applications",
            "Total Applications": "Total Applications",
            "All KYC applications": "All KYC applications",
            "Pending Review": "Pending Review",
            "Waiting for verification": "Waiting for verification",
            "Successfully approved": "Successfully approved",
            "Applications rejected": "Applications rejected",
            "Identity verification reminder": "Identity verification reminder",
            "Check the submitted documents carefully before approving an application. Only approve documents that meet your verification requirements.": "Check the submitted documents carefully before approving an application. Only approve documents that meet your verification requirements.",
            "KYC Applications": "KYC Applications",
            "Review and manage farmer identity verification requests.": "Review and manage farmer identity verification requests.",
            "Application Management": "Application Management",
            "Search name, application ID or mobile...": "Search name, application ID or mobile...",
            "All Documents": "All Documents",
            "Aadhaar Card": "Aadhaar Card",
            "PAN Card": "PAN Card",
            "Voter ID": "Voter ID",
            "Application ID": "Application ID",
            "Document Type": "Document Type",
            "Submitted On": "Submitted On",
            "No applications found": "No applications found",
            "Try changing your search term or filters.": "Try changing your search term or filters.",
            "Showing 8 applications": "Showing 8 applications",
            "Sample records for frontend demonstration": "Sample records for frontend demonstration",
            "KYC Application Details": "KYC Application Details",
            "Review the application information below.": "Review the application information below.",
            "Current Status": "Current Status",
            "Review Remarks": "Review Remarks",
            "Document preview unavailable": "Document preview unavailable",
            "Connect the uploaded document URL from your database to display the actual document here.": "Connect the uploaded document URL from your database to display the actual document here.",
            "View application": "View application",
            "Approve application": "Approve application",
            "Reject application": "Reject application",




            // 1. Manage Complaints - English


            "Manage Complaints": "Manage Complaints",
            "View and manage complaints submitted by farmers and buyers.": "View and manage complaints submitted by farmers and buyers.",
            "Back": "Back",
            "Total Complaints": "Total Complaints",
            "Pending": "Pending",
            "Resolved": "Resolved",
            "Complaint Records": "Complaint Records",
            "ID": "ID",
            "User Name": "User Name",
            "User Type": "User Type",
            "Complaint": "Complaint",
            "Date": "Date",
            "Status": "Status",
            "Action": "Action",
            "Farmer": "Farmer",
            "Buyer": "Buyer",
            "Payment not received": "Payment not received",
            "Order delivery issue": "Order delivery issue",
            "Incorrect product price": "Incorrect product price",
            "View": "View",
            "Reply": "Reply",
            "Resolve": "Resolve",





            // 2. Manage Banners - English

            "Manage Banners": "Manage Banners",
            "Add and manage promotional banners for the marketplace.": "Add and manage promotional banners for the marketplace.",
            "Back": "Back",
            "Add New Banner": "Add New Banner",
            "Banner Title": "Banner Title",
            "Enter banner title": "Enter banner title",
            "Description": "Description",
            "Enter banner description": "Enter banner description",
            "Banner Image": "Banner Image",
            "Banner Link": "Banner Link",
            "Status": "Status",
            "Active": "Active",
            "Inactive": "Inactive",
            "Add Banner": "Add Banner",
            "Existing Banners": "Existing Banners",
            "Fresh From Farms": "Fresh From Farms",
            "Fresh Farm Products": "Fresh Farm Products",
            "Discover fresh produce directly from farmers.": "Discover fresh produce directly from farmers.",
            "Support Local Farmers": "Support Local Farmers",
            "Connect directly with local agricultural producers.": "Connect directly with local agricultural producers.",
            "Edit": "Edit",
            "Delete": "Delete",






            // 3. Manage Locations - English

            "Manage Locations": "Manage Locations",
            "Manage districts, talukas and villages.": "Manage districts, talukas and villages.",
            "Add Location": "Add Location",
            "Select State": "Select State",
            "Select District": "Select District",
            "Select Taluka": "Select Taluka",
            "Select Village": "Select Village",
            "Maharashtra": "Maharashtra",
            "Madhya Pradesh": "Madhya Pradesh",
            "Manipur": "Manipur",
            "Meghalaya": "Meghalaya",
            "Mizoram": "Mizoram",
            "Goa": "Goa",
            "Ahilyanagar": "Ahilyanagar",
            "Akola": "Akola",
            "Amravati": "Amravati",
            "Beed": "Beed",
            "Bhandara": "Bhandara",
            "Buldhana": "Buldhana",
            "Chandrapur": "Chandrapur",
            "Chhatrapati Sambhajinagar": "Chhatrapati Sambhajinagar",
            "Dharashiv": "Dharashiv",
            "Dhule": "Dhule",
            "Gadchiroli": "Gadchiroli",
            "Gondia": "Gondia",
            "Hingoli": "Hingoli",
            "Jalgaon": "Jalgaon",
            "Jalna": "Jalna",
            "Kolhapur": "Kolhapur",
            "Latur": "Latur",
            "Mumbai City": "Mumbai City",
            "Mumbai Suburban": "Mumbai Suburban",
            "Nagpur": "Nagpur",
            "Nanded": "Nanded",
            "Nandurbar": "Nandurbar",
            "Nashik": "Nashik",
            "Palghar": "Palghar",
            "Parbhani": "Parbhani",
            "Pune": "Pune",
            "Raigad": "Raigad",
            "Ratnagiri": "Ratnagiri",
            "Sangli": "Sangli",
            "Satara": "Satara",
            "Sindhudurg": "Sindhudurg",
            "Solapur": "Solapur",
            "Thane": "Thane",
            "Wardha": "Wardha",
            "Washim": "Washim",
            "Yavatmal": "Yavatmal",
            "Rahuri": "Rahuri",
            "Rahata": "Rahata",
            "Shrirampur": "Shrirampur",
            "Sangamner": "Sangamner",
            "Haveli": "Haveli",
            "Baramati": "Baramati",
            "Junnar": "Junnar",
            "Niphad": "Niphad",
            "Sinnar": "Sinnar",
            "Yeola": "Yeola",
            "Sample Village": "Sample Village",
            "Savedi": "Savedi",
            "Kedgaon": "Kedgaon",
            "Burudgaon": "Burudgaon",
            "Location List": "Location List",
            "Sr. No.": "Sr. No.",
            "District": "District",
            "Taluka": "Taluka",
            "Village": "Village",
            "Status": "Status",
            "Active": "Active",
            "Inactive": "Inactive",
            "Back": "Back",







            // 4. Sales and User Reports - English

            "Sales and User Reports": "Sales and User Reports",
            "Monitor marketplace sales and registered users.": "Monitor marketplace sales and registered users.",
            "Back": "Back",
            "Total Sales": "Total Sales",
            "Overall marketplace sales": "Overall marketplace sales",
            "Total Orders": "Total Orders",
            "Orders received": "Orders received",
            "Total Farmers": "Total Farmers",
            "Registered farmers": "Registered farmers",
            "Total Buyers": "Total Buyers",
            "Registered buyers": "Registered buyers",
            "Filter Reports": "Filter Reports",
            "Report Type": "Report Type",
            "Sales Report": "Sales Report",
            "User Report": "User Report",
            "From Date": "From Date",
            "To Date": "To Date",
            "Status": "Status",
            "All Statuses": "All Statuses",
            "Completed": "Completed",
            "Pending": "Pending",
            "Cancelled": "Cancelled",
            "Active": "Active",
            "Inactive": "Inactive",
            "Apply Filters": "Apply Filters",
            "Summary of marketplace transactions.": "Summary of marketplace transactions.",
            "Excel": "Excel",
            "PDF": "PDF",
            "Sr. No.": "Sr. No.",
            "Order ID": "Order ID",
            "Date": "Date",
            "Buyer": "Buyer",
            "Farmer": "Farmer",
            "Amount": "Amount",
            "No sales records available.": "No sales records available.",
            "Registered users and account status.": "Registered users and account status.",
            "User Name": "User Name",
            "Email": "Email",
            "Role": "Role",
            "Registration Date": "Registration Date",
            "No user records available.": "No user records available.",






            // 5. Profile & Settings
            "Profile & Settings": "Profile & Settings",
            "Manage your account, marketplace and system preferences.": "Manage your account, marketplace and system preferences.",
            "Admin Account": "Admin Account",
            "Profile": "Profile",
            "Security": "Security",
            "Admins": "Admins",
            "General": "General",
            "Notifications": "Notifications",
            "Marketplace": "Marketplace",
            "Activity Log": "Activity Log",
            "Backup": "Backup",
            "Email & SMS": "Email & SMS",
            "System Info": "System Info",

            // Admin Profile
            "Admin Profile": "Admin Profile",
            "Full Name": "Full Name",
            "Email Address": "Email Address",
            "Mobile Number": "Mobile Number",
            "Role": "Role",
            "Save Profile": "Save Profile",

            // Security
            "Security Settings": "Security Settings",
            "Current Password": "Current Password",
            "New Password": "New Password",
            "Confirm New Password": "Confirm New Password",
            "Two-Factor Authentication": "Two-Factor Authentication",
            "Change Password": "Change Password",
            "Logout": "Logout",

            // Admin Management
            "Admin Management": "Admin Management",
            "Admin Name": "Admin Name",
            "Admin Email": "Admin Email",
            "Assign Role": "Assign Role",
            "Super Admin": "Super Admin",
            "Support Admin": "Support Admin",
            "Report Viewer": "Report Viewer",
            "Account Status": "Account Status",
            "Inactive": "Inactive",
            "Add Admin": "Add Admin",

            // General Settings
            "General Settings": "General Settings",
            "Website Name": "Website Name",
            "Language": "Language",
            "Date Format": "Date Format",
            "Appearance": "Appearance",
            "Light Mode": "Light Mode",
            "Dark Mode": "Dark Mode",
            "Save General Settings": "Save General Settings",

            // Notification Settings
            "Notification Settings": "Notification Settings",
            "New User Registrations": "New User Registrations",
            "New Orders": "New Orders",
            "Farmer Complaints": "Farmer Complaints",
            "Email Notifications": "Email Notifications",
            "In-App Notifications": "In-App Notifications",
            "Save Notification Settings": "Save Notification Settings",

            // Marketplace Configuration
            "Marketplace Configuration": "Marketplace Configuration",
            "Platform Commission (%)": "Platform Commission (%)",
            "Minimum Order Quantity": "Minimum Order Quantity",
            "Product Approval": "Product Approval",
            "Manual Admin Approval": "Manual Admin Approval",
            "Automatic Approval": "Automatic Approval",
            "Payment Configuration": "Payment Configuration",
            "Cash on Delivery": "Cash on Delivery",
            "Online Payment": "Online Payment",
            "Both": "Both",
            "Save Marketplace Settings": "Save Marketplace Settings",

            // Activity Log
            "Activity": "Activity",
            "Performed By": "Performed By",
            "Date & Time": "Date & Time",
            "No records": "No records",

            // Backup & Restore
            "Backup & Restore": "Backup & Restore",
            "Database Backup": "Database Backup",
            "Create Backup": "Create Backup",
            "Select Backup File": "Select Backup File",
            "Restore Backup": "Restore Backup",

            // Email & SMS
            "Email & SMS Configuration": "Email & SMS Configuration",
            "Sender Email": "Sender Email",
            "Email Service": "Email Service",
            "SMTP": "SMTP",
            "Email API Provider": "Email API Provider",
            "SMS Provider": "SMS Provider",
            "Support Contact Email": "Support Contact Email",
            "Save Communication Settings": "Save Communication Settings",

            // System Information
            "System Information": "System Information",
            "Application": "Application",
            "Application Version": "Application Version",
            "Database Status": "Database Status",
            "Server Status": "Server Status",
            "Not Connected to Status API": "Not Connected to Status API",


            // manage-categories  to  manage-orders

            "Category Management": "Category Management",
            "Manage Categories": "Manage Categories",
            "Organize and manage marketplace product categories.": "Organize and manage marketplace product categories.",
            "Export Categories": "Export Categories",
            "Add Category": "Add Category",
            "All marketplace categories": "All marketplace categories",
            "Visible in marketplace": "Visible in marketplace",
            "Hidden from marketplace": "Hidden from marketplace",
            "Product Types": "Product Types",
            "Unique categories listed": "Unique categories listed",
            "Category List": "Category List",
            "Create, update and control marketplace categories.": "Create, update and control marketplace categories.",
            "Records": "Records",
            "Search category name or description...": "Search category name or description...",
            "All Statuses": "All Statuses",
            "Active": "Active",
            "Inactive": "Inactive",
            "Reset": "Reset",
            "Category": "Category",
            "Description": "Description",
            "Slug": "Slug",
            "Products": "Products",
            "Created Date": "Created Date",
            "Status": "Status",
            "Actions": "Actions",
            "Edit": "Edit",
            "Delete": "Delete",
            "Deactivate": "Deactivate",
            "Activate": "Activate",
            "No categories found": "No categories found",
            "Try changing your search or filters.": "Try changing your search or filters.",
            "Sample records for frontend demonstration": "Sample records for frontend demonstration",
            "Category Settings": "Category Settings",
            "Add New Category": "Add New Category",
            "Edit Category": "Edit Category",
            "Category Name": "Category Name",
            "Enter category name": "Enter category name",
            "Enter category description": "Enter category description",
            "Icon": "Icon",
            "The category slug is generated automatically from its name.": "The category slug is generated automatically from its name.",
            "Cancel": "Cancel",
            "Save Category": "Save Category",
            "Update Category": "Update Category",
            "Category added successfully.": "Category added successfully.",
            "Category updated successfully.": "Category updated successfully.",
            "Delete this category?": "Delete this category?",
            "Category deleted successfully.": "Category deleted successfully.",
            "Change category status?": "Change category status?",
            "Category status updated.": "Category status updated.",
            "A category with this name already exists.": "A category with this name already exists.",
            "Category name is required.": "Category name is required.",
            "Showing": "Showing",
            "categories": "categories",
            "Export category records": "Export category records",
            "No categories to export.": "No categories to export.",



            "Export Products": "Export Products",
            "Total Products": "Total Products",
            "Products submitted by farmers": "Products submitted by farmers",
            "Pending Approval": "Pending Approval",
            "Waiting for admin review": "Waiting for admin review",
            "Approved Products": "Approved Products",
            "Available for buyers": "Available for buyers",
            "Rejected Products": "Rejected Products",
            "Products not approved": "Products not approved",
            "Product Verification": "Product Verification",
            "Check product details, quantity, price and farmer information before approving a listing.": "Check product details, quantity, price and farmer information before approving a listing.",
            "Product Approval List": "Product Approval List",
            "Review and manage submitted marketplace products.": "Review and manage submitted marketplace products.",
            "Records": "Records",
            "Search product, farmer or location...": "Search product, farmer or location...",
            "All Categories": "All Categories",
            "Product": "Product",
            "Farmer": "Farmer",
            "Category": "Category",
            "Quantity": "Quantity",
            "Price": "Price",
            "Approved": "Approved",
            "View product": "View product",
            "Approve product": "Approve product",
            "Reject product": "Reject product",
            "No products found": "No products found",
            "Try changing your search or filters.": "Try changing your search or filters.",
            "Showing 8 products": "Showing 8 products",
            "Sample records for frontend demonstration": "Sample records for frontend demonstration",
            "Product Details": "Product Details",
            "Location": "Location",
            "Close": "Close",
            "Approve this product?": "Approve this product?",
            "Reject this product?": "Reject this product?",
            "Product approved successfully. This is a frontend-only change.": "Product approved successfully. This is a frontend-only change.",
            "Product rejected. This is a frontend-only change.": "Product rejected. This is a frontend-only change.",
            "Product status updated.": "Product status updated.",
            "All products": "All products",
            "Showing": "Showing",
            "products": "products",
            "Export product records": "Export product records",
            "No products to export.": "No products to export.",


            "Order Management": "Order Management",
            "Manage Orders": "Manage Orders",
            "Track, review and manage marketplace orders.": "Track, review and manage marketplace orders.",
            "Export Orders": "Export Orders",
            "Total Orders": "Total Orders",
            "All marketplace orders": "All marketplace orders",
            "Pending Orders": "Pending Orders",
            "Awaiting confirmation": "Awaiting confirmation",
            "Processing Orders": "Processing Orders",
            "Being prepared or shipped": "Being prepared or shipped",
            "Completed Orders": "Completed Orders",
            "Successfully delivered": "Successfully delivered",
            "Orders List": "Orders List",
            "View and update customer order information.": "View and update customer order information.",
            "Records": "Records",
            "Search order, buyer or product...": "Search order, buyer or product...",
            "All Statuses": "All Statuses",
            "Pending": "Pending",
            "Confirmed": "Confirmed",
            "Processing": "Processing",
            "Shipped": "Shipped",
            "Delivered": "Delivered",
            "Cancelled": "Cancelled",
            "Reset": "Reset",
            "Order ID": "Order ID",
            "Buyer": "Buyer",
            "Product": "Product",
            "Quantity": "Quantity",
            "Total Amount": "Total Amount",
            "Order Date": "Order Date",
            "Status": "Status",
            "Actions": "Actions",
            "View Order": "View Order",
            "No orders found": "No orders found",
            "Try changing your search or filters.": "Try changing your search or filters.",
            "Sample records for frontend demonstration": "Sample records for frontend demonstration",
            "Order Details": "Order Details",
            "Email": "Email",
            "Phone": "Phone",
            "Delivery Location": "Delivery Location",
            "Close": "Close",
            "Showing": "Showing",
            "orders": "orders",
            "Order status updated successfully.": "Order status updated successfully.",
            "Export order records": "Export order records",
            "No orders to export.": "No orders to export.",
            "Confirm status change?": "Confirm status change?",



            "Enquiry Management": "Enquiry Management",
            "Manage Enquiries": "Manage Enquiries",
            "Review and manage buyer enquiries submitted for farmer products.": "Review and manage buyer enquiries submitted for farmer products.",
            "Export Enquiries": "Export Enquiries",
            "Total Enquiries": "Total Enquiries",
            "All submitted enquiries": "All submitted enquiries",
            "Pending Enquiries": "Pending Enquiries",
            "Waiting for review": "Waiting for review",
            "Accepted Enquiries": "Accepted Enquiries",
            "Approved by farmers": "Approved by farmers",
            "Rejected Enquiries": "Rejected Enquiries",
            "Declined enquiries": "Declined enquiries",
            "Enquiry List": "Enquiry List",
            "Review buyer requests and track their current status.": "Review buyer requests and track their current status.",
            "Records": "Records",
            "Search buyer, product or enquiry ID...": "Search buyer, product or enquiry ID...",
            "All Statuses": "All Statuses",
            "Pending": "Pending",
            "Accepted": "Accepted",
            "Rejected": "Rejected",
            "All Categories": "All Categories",
            "Vegetables": "Vegetables",
            "Fruits": "Fruits",
            "Grains": "Grains",
            "Pulses": "Pulses",
            "Reset": "Reset",
            "Enquiry ID": "Enquiry ID",
            "Buyer": "Buyer",
            "Product": "Product",
            "Farmer": "Farmer",
            "Requested Quantity": "Requested Quantity",
            "Offered Price": "Offered Price",
            "Date": "Date",
            "Status": "Status",
            "Actions": "Actions",
            "View Enquiry": "View Enquiry",
            "Accept Enquiry": "Accept Enquiry",
            "Reject Enquiry": "Reject Enquiry",
            "No enquiries found": "No enquiries found",
            "Try changing your search or filters.": "Try changing your search or filters.",
            "Sample records for frontend demonstration": "Sample records for frontend demonstration",
            "Enquiry Details": "Enquiry Details",
            "Email": "Email",
            "Phone": "Phone",
            "Location": "Location",
            "Buyer Message": "Buyer Message",
            "Close": "Close",
            "Showing": "Showing",
            "enquiries": "enquiries",
            "Confirm Accept": "Accept this enquiry?",
            "Confirm Reject": "Reject this enquiry?",
            "Enquiry accepted successfully.": "Enquiry accepted successfully.",
            "Enquiry rejected successfully.": "Enquiry rejected successfully.",
            "Export enquiry records": "Export enquiry records",
            "No enquiries to export.": "No enquiries to export.",



        },

        mr: {
            "Dashboard": "डॅशबोर्ड",
            "Statistics": "आकडेवारी",
            "Manage Farmers": "शेतकरी व्यवस्थापन",
            "Manage Buyers": "खरेदीदार व्यवस्थापन",
            "Verify KYC": "केवायसी पडताळणी",
            "Manage Categories": "श्रेणी व्यवस्थापन",
            "Approve Products": "उत्पादनांना मंजुरी",
            "Manage Orders": "ऑर्डर व्यवस्थापन",
            "Manage Enquiries": "चौकशी व्यवस्थापन",
            "Manage Complaints": "तक्रार व्यवस्थापन",
            "Manage Banners": "बॅनर व्यवस्थापन",
            "Manage Districts / Talukas": "जिल्हे / तालुके व्यवस्थापन",
            "Sales and User Reports": "विक्री आणि वापरकर्ता अहवाल",
            "Admin Profile": "प्रशासक प्रोफाइल",
            "Settings": "सेटिंग्ज",
            "English": "मराठी",
            "Search": "शोधा",
            "Search farmers...": "शेतकरी शोधा...",
            "Search buyers...": "खरेदीदार शोधा...",
            "Search name, application ID or mobile...":
                "नाव, अर्ज क्रमांक किंवा मोबाइल शोधा...",
            "Total Applications": "एकूण अर्ज",
            "Pending Review": "पडताळणी प्रलंबित",
            "Verified": "पडताळणी पूर्ण",
            "Rejected": "नाकारलेले",
            "KYC Applications": "केवायसी अर्ज",
            "All Statuses": "सर्व स्थिती",
            "All Documents": "सर्व कागदपत्रे",
            "Pending": "प्रलंबित",
            "Reset": "रीसेट करा",
            "Export Applications": "अर्ज निर्यात करा",
            "Farmer Details": "शेतकऱ्याची माहिती",
            "Document Type": "कागदपत्राचा प्रकार",
            "Submitted On": "सादर केल्याची तारीख",
            "Actions": "कृती",
            "No applications found": "कोणतेही अर्ज आढळले नाहीत",
            "Review the submitted documents carefully before approving an application.":
                "अर्ज मंजूर करण्यापूर्वी सादर केलेली कागदपत्रे काळजीपूर्वक तपासा.",
            "ADMIN PANEL": "प्रशासक पॅनेल",
            "MAIN MENU": "मुख्य मेनू",
            "USER MANAGEMENT": "वापरकर्ता व्यवस्थापन",
            "MARKETPLACE": "बाजारपेठ",
            "PLATFORM SETTINGS": "प्लॅटफॉर्म सेटिंग्ज",
            "ACCOUNT": "खाते",
            "Dashboard": "डॅशबोर्ड",
            "Statistics": "आकडेवारी",
            "Manage Farmers": "शेतकरी व्यवस्थापन",
            "Manage Buyers": "खरेदीदार व्यवस्थापन",
            "Verify KYC": "KYC पडताळणी",
            "Manage Categories": "वर्ग व्यवस्थापन",
            "Approve Products": "उत्पादनांना मंजुरी",
            "Manage Orders": "ऑर्डर व्यवस्थापन",
            "Manage Enquiries": "चौकशी व्यवस्थापन",
            "Manage Complaints": "तक्रार व्यवस्थापन",
            "Manage Banners": "बॅनर व्यवस्थापन",
            "Manage Districts / Talukas": "जिल्हे / तालुके व्यवस्थापन",
            "Sales & User Reports": "विक्री आणि वापरकर्ता अहवाल",
            "Admin Profile": "प्रशासक प्रोफाइल",
            "Settings": "सेटिंग्ज",
            "Admin Workspace": "प्रशासक कार्यक्षेत्र",
            "Manage KisanSetu securely": "KisanSetu सुरक्षितपणे व्यवस्थापित करा",
            "Welcome to your KisanSetu workspace": "तुमच्या KisanSetu कार्यक्षेत्रात स्वागत आहे",
            "Notifications": "सूचना",
            "KYC verification": "KYC पडताळणी",
            "Review pending farmer documents.": "प्रलंबित शेतकरी कागदपत्रे तपासा.",
            "Product approvals": "उत्पादन मंजुरी",
            "Check products awaiting review.": "पुनरावलोकनासाठी असलेली उत्पादने तपासा.",
            "Complaints": "तक्रारी",
            "Review unresolved complaints.": "प्रलंबित तक्रारी तपासा.",
            "Administrator": "प्रशासक",
            "System Admin": "सिस्टम प्रशासक",
            "Sign Out": "बाहेर पडा",
            "Marketplace Statistics": "बाजारपेठेची आकडेवारी",
            "Monitor users, products, orders and marketplace performance.": "वापरकर्ते, उत्पादने, ऑर्डर आणि बाजारपेठेच्या कामगिरीवर लक्ष ठेवा.",
            "Refresh Statistics": "आकडेवारी रिफ्रेश करा",
            "Farmers": "शेतकरी",
            "Registered farmers": "नोंदणीकृत शेतकरी",
            "View Farmers": "शेतकरी पहा",
            "Buyers": "खरेदीदार",
            "Registered buyers": "नोंदणीकृत खरेदीदार",
            "View Buyers": "खरेदीदार पहा",
            "Products": "उत्पादने",
            "Listed marketplace products": "बाजारपेठेत सूचीबद्ध उत्पादने",
            "View Products": "उत्पादने पहा",
            "Orders": "ऑर्डर",
            "Total marketplace orders": "एकूण बाजारपेठ ऑर्डर",
            "View Orders": "ऑर्डर पहा",
            "Pending KYC": "प्रलंबित KYC",
            "Review documents": "कागदपत्रे तपासा",
            "Pending Products": "प्रलंबित उत्पादने",
            "Review products": "उत्पादने तपासा",
            "Open Complaints": "प्रलंबित तक्रारी",
            "Review complaints": "तक्रारी तपासा",
            "User Distribution": "वापरकर्त्यांचे वितरण",
            "Farmers compared with buyers": "शेतकरी आणि खरेदीदारांची तुलना",
            "User registration overview": "वापरकर्ता नोंदणीचा आढावा",
            "Marketplace Overview": "बाजारपेठेचा आढावा",
            "Product approval and order status": "उत्पादन मंजुरी आणि ऑर्डरची स्थिती",
            "Current marketplace summary": "सध्याच्या बाजारपेठेचा सारांश",
            "Quick Reports": "जलद अहवाल",
            "Access important marketplace records": "महत्त्वाच्या बाजारपेठेच्या नोंदी पहा",
            "Sales and User Reports": "विक्री आणि वापरकर्ता अहवाल",
            "Review sales and registration data": "विक्री आणि नोंदणीची माहिती तपासा",
            "Order Reports": "ऑर्डर अहवाल",
            "Review marketplace transactions": "बाजारपेठेतील व्यवहार तपासा",
            "Location Management": "स्थान व्यवस्थापन",
            "Manage districts and talukas": "जिल्हे आणि तालुके व्यवस्थापित करा",
            "Statistics Summary": "आकडेवारीचा सारांश",
            "Overview of the platform": "प्लॅटफॉर्मचा आढावा",
            "Marketplace Users": "बाजारपेठेतील वापरकर्ते",
            "Approved Products": "मंजूर उत्पादने",
            "Completed Orders": "पूर्ण झालेल्या ऑर्डर",
            "Report Generated": "अहवाल तयार केला",
            "Statistics will display live database figures after the admin statistics API is connected.": "प्रशासक आकडेवारी API जोडल्यावर डेटाबेसमधील थेट आकडेवारी येथे दिसेल.",
            "Manage Buyers": "खरेदीदार व्यवस्थापन",
            "View and manage buyer accounts registered on KisanSetu.": "KisanSetu वर नोंदणीकृत खरेदीदारांची खाती पहा आणि व्यवस्थापित करा.",
            "Export Buyers": "खरेदीदारांची माहिती निर्यात करा",
            "Total Buyers": "एकूण खरेदीदार",
            "Registered accounts": "नोंदणीकृत खाती",
            "Active Buyers": "सक्रिय खरेदीदार",
            "Currently active": "सध्या सक्रिय",
            "Pending Verification": "पडताळणी प्रलंबित",
            "Awaiting verification": "पडताळणीची प्रतीक्षा",
            "Suspended Buyers": "निलंबित खरेदीदार",
            "Accounts suspended": "निलंबित खाती",
            "Buyer Directory": "खरेदीदारांची यादी",
            "Review buyer details and account status.": "खरेदीदारांची माहिती आणि खात्याची स्थिती तपासा.",
            "sample records": "नमुना नोंदी",
            "Search by name, email or mobile...": "नाव, ईमेल किंवा मोबाईलद्वारे शोधा...",
            "All Statuses": "सर्व स्थिती",
            "Active": "सक्रिय",
            "Pending": "प्रलंबित",
            "Suspended": "निलंबित",
            "Reset": "रीसेट करा",
            "Buyer": "खरेदीदार",
            "Mobile Number": "मोबाईल क्रमांक",
            "Registered On": "नोंदणी दिनांक",
            "Total Orders": "एकूण ऑर्डर",
            "Status": "स्थिती",
            "Actions": "कृती",
            "View buyer": "खरेदीदाराची माहिती पहा",
            "Edit buyer": "खरेदीदाराची माहिती संपादित करा",
            "No buyers found": "खरेदीदार आढळले नाहीत",
            "Try changing your search or status filter.": "शोध किंवा स्थिती फिल्टर बदलून पहा.",
            "Showing 1–8 of 8 sample records": "८ पैकी १–८ नमुना नोंदी दाखवत आहे",
            "Buyer Details": "खरेदीदाराची माहिती",
            "Buyer account information": "खरेदीदाराच्या खात्याची माहिती",
            "Email": "ईमेल",
            "Mobile": "मोबाईल",
            "Close": "बंद करा",
            "Previous page": "मागील पृष्ठ",
            "Next page": "पुढील पृष्ठ",
            "Manage Farmers": "शेतकरी व्यवस्थापन",
            "Manage farmer accounts and monitor their marketplace activity.": "शेतकऱ्यांची खाती व्यवस्थापित करा आणि बाजारपेठेतील त्यांच्या हालचालींवर लक्ष ठेवा.",
            "Export Farmers": "शेतकऱ्यांची माहिती निर्यात करा",
            "Total Farmers": "एकूण शेतकरी",
            "Registered farmer accounts": "नोंदणीकृत शेतकरी खाती",
            "Active Farmers": "सक्रिय शेतकरी",
            "Currently active": "सध्या सक्रिय",
            "Pending KYC": "KYC प्रलंबित",
            "Verification required": "पडताळणी आवश्यक",
            "Suspended Farmers": "निलंबित शेतकरी",
            "Accounts suspended": "निलंबित खाती",
            "Farmer Directory": "शेतकऱ्यांची यादी",
            "Review farmer profiles, locations, KYC status and activity.": "शेतकऱ्यांची प्रोफाइल, ठिकाणे, KYC स्थिती आणि हालचाली तपासा.",
            "sample records": "नमुना नोंदी",
            "Search by name, email, mobile or village...": "नाव, ईमेल, मोबाईल किंवा गावाद्वारे शोधा...",
            "All Account Statuses": "सर्व खाते स्थिती",
            "All KYC Statuses": "सर्व KYC स्थिती",
            "Active": "सक्रिय",
            "Pending": "प्रलंबित",
            "Suspended": "निलंबित",
            "Verified": "पडताळलेले",
            "Rejected": "नाकारलेले",
            "Reset": "रीसेट करा",
            "Farmer": "शेतकरी",
            "Mobile Number": "मोबाईल क्रमांक",
            "Village / District": "गाव / जिल्हा",
            "Farm Size": "शेताचे क्षेत्रफळ",
            "KYC Status": "KYC स्थिती",
            "Account Status": "खात्याची स्थिती",
            "Actions": "कृती",
            "No farmers found": "शेतकरी आढळले नाहीत",
            "Try changing your search or filters.": "तुमचा शोध किंवा फिल्टर बदलून पहा.",
            "Showing 1–8 of 8 sample records": "८ पैकी १–८ नमुना नोंदी दाखवत आहे",
            "Farmer Details": "शेतकऱ्याची माहिती",
            "Farmer account information": "शेतकऱ्याच्या खात्याची माहिती",
            "Email": "ईमेल",
            "Mobile": "मोबाईल",
            "Location": "ठिकाण",
            "Close": "बंद करा",
            "Verify KYC": "KYC पडताळणी",
            "Review farmer identity documents and manage KYC verification applications.": "शेतकऱ्यांची ओळखपत्रे तपासा आणि KYC पडताळणी अर्ज व्यवस्थापित करा.",
            "Export Applications": "अर्ज निर्यात करा",
            "Total Applications": "एकूण अर्ज",
            "All KYC applications": "सर्व KYC अर्ज",
            "Pending Review": "पडताळणीसाठी प्रलंबित",
            "Waiting for verification": "पडताळणीच्या प्रतीक्षेत",
            "Successfully approved": "यशस्वीरीत्या मंजूर",
            "Applications rejected": "नाकारलेले अर्ज",
            "Identity verification reminder": "ओळख पडताळणीसाठी सूचना",
            "Check the submitted documents carefully before approving an application. Only approve documents that meet your verification requirements.": "अर्ज मंजूर करण्यापूर्वी सादर केलेली कागदपत्रे काळजीपूर्वक तपासा. पडताळणीच्या आवश्यक अटी पूर्ण करणारी कागदपत्रेच मंजूर करा.",
            "KYC Applications": "KYC अर्ज",
            "Review and manage farmer identity verification requests.": "शेतकऱ्यांच्या ओळख पडताळणीच्या विनंत्या तपासा आणि व्यवस्थापित करा.",
            "Application Management": "अर्ज व्यवस्थापन",
            "Search name, application ID or mobile...": "नाव, अर्ज क्रमांक किंवा मोबाईलद्वारे शोधा...",
            "All Documents": "सर्व कागदपत्रे",
            "Aadhaar Card": "आधार कार्ड",
            "PAN Card": "पॅन कार्ड",
            "Voter ID": "मतदार ओळखपत्र",
            "Application ID": "अर्ज क्रमांक",
            "Document Type": "कागदपत्राचा प्रकार",
            "Submitted On": "सादर केल्याची तारीख",
            "No applications found": "कोणतेही अर्ज आढळले नाहीत",
            "Try changing your search term or filters.": "शोध शब्द किंवा फिल्टर बदलून पहा.",
            "Showing 8 applications": "८ अर्ज दाखवत आहे",
            "Sample records for frontend demonstration": "फ्रंटएंड प्रात्यक्षिकासाठी नमुना नोंदी",
            "KYC Application Details": "KYC अर्जाचा तपशील",
            "Review the application information below.": "खालील अर्जाची माहिती तपासा.",
            "Current Status": "सध्याची स्थिती",
            "Review Remarks": "पडताळणीसंबंधी टिप्पणी",
            "Document preview unavailable": "कागदपत्राचे पूर्वावलोकन उपलब्ध नाही",
            "Connect the uploaded document URL from your database to display the actual document here.": "प्रत्यक्ष कागदपत्र येथे दाखवण्यासाठी डेटाबेसमधील अपलोड केलेल्या कागदपत्राची URL जोडा.",
            "View application": "अर्ज पहा",
            "Approve application": "अर्ज मंजूर करा",
            "Reject application": "अर्ज नाकारा",






            //  1.Manage Complaints - Marathi



            "Manage Complaints": "तक्रारी व्यवस्थापन",
            "View and manage complaints submitted by farmers and buyers.": "शेतकरी आणि खरेदीदारांनी केलेल्या तक्रारी पहा आणि व्यवस्थापित करा.",
            "Back": "मागे",
            "Total Complaints": "एकूण तक्रारी",
            "Pending": "प्रलंबित",
            "Resolved": "निकाली काढलेल्या",
            "Complaint Records": "तक्रारींची नोंद",
            "ID": "क्रमांक",
            "User Name": "वापरकर्त्याचे नाव",
            "User Type": "वापरकर्त्याचा प्रकार",
            "Complaint": "तक्रार",
            "Date": "दिनांक",
            "Status": "स्थिती",
            "Action": "कृती",
            "Farmer": "शेतकरी",
            "Buyer": "खरेदीदार",
            "Payment not received": "पेमेंट मिळाले नाही",
            "Order delivery issue": "ऑर्डर डिलिव्हरीची समस्या",
            "Incorrect product price": "उत्पादनाची चुकीची किंमत",
            "View": "पहा",
            "Reply": "उत्तर द्या",
            "Resolve": "तक्रार निकाली काढा",






            // 2. Manage Banners - Marathi

            "Manage Banners": "बॅनर व्यवस्थापन",
            "Add and manage promotional banners for the marketplace.": "मार्केटप्लेससाठी जाहिरातींचे बॅनर जोडा आणि व्यवस्थापित करा.",
            "Back": "मागे",
            "Add New Banner": "नवीन बॅनर जोडा",
            "Banner Title": "बॅनरचे शीर्षक",
            "Enter banner title": "बॅनरचे शीर्षक टाका",
            "Description": "वर्णन",
            "Enter banner description": "बॅनरचे वर्णन टाका",
            "Banner Image": "बॅनरची प्रतिमा",
            "Banner Link": "बॅनरची लिंक",
            "Status": "स्थिती",
            "Active": "सक्रिय",
            "Inactive": "निष्क्रिय",
            "Add Banner": "बॅनर जोडा",
            "Existing Banners": "सध्याचे बॅनर",
            "Fresh From Farms": "शेतातून ताजे",
            "Fresh Farm Products": "शेतातील ताजी उत्पादने",
            "Discover fresh produce directly from farmers.": "शेतकऱ्यांकडून थेट ताजा शेतमाल मिळवा.",
            "Support Local Farmers": "स्थानिक शेतकऱ्यांना समर्थन द्या",
            "Connect directly with local agricultural producers.": "स्थानिक शेतमाल उत्पादकांशी थेट संपर्क साधा.",
            "Edit": "संपादित करा",
            "Delete": "हटवा",




            // 3. Manage Locations - Marathi

            "Manage Locations": "ठिकाणांचे व्यवस्थापन",
            "Manage districts, talukas and villages.": "जिल्हे, तालुके आणि गावांचे व्यवस्थापन करा.",
            "Add Location": "ठिकाण जोडा",
            "Select State": "राज्य निवडा",
            "Select District": "जिल्हा निवडा",
            "Select Taluka": "तालुका निवडा",
            "Select Village": "गाव निवडा",
            "Maharashtra": "महाराष्ट्र",
            "Madhya Pradesh": "मध्य प्रदेश",
            "Manipur": "मणिपूर",
            "Meghalaya": "मेघालय",
            "Mizoram": "मिझोराम",
            "Goa": "गोवा",
            "Ahilyanagar": "अहिल्यानगर",
            "Akola": "अकोला",
            "Amravati": "अमरावती",
            "Beed": "बीड",
            "Bhandara": "भंडारा",
            "Buldhana": "बुलढाणा",
            "Chandrapur": "चंद्रपूर",
            "Chhatrapati Sambhajinagar": "छत्रपती संभाजीनगर",
            "Dharashiv": "धाराशिव",
            "Dhule": "धुळे",
            "Gadchiroli": "गडचिरोली",
            "Gondia": "गोंदिया",
            "Hingoli": "हिंगोली",
            "Jalgaon": "जळगाव",
            "Jalna": "जालना",
            "Kolhapur": "कोल्हापूर",
            "Latur": "लातूर",
            "Mumbai City": "मुंबई शहर",
            "Mumbai Suburban": "मुंबई उपनगर",
            "Nagpur": "नागपूर",
            "Nanded": "नांदेड",
            "Nandurbar": "नंदुरबार",
            "Nashik": "नाशिक",
            "Palghar": "पालघर",
            "Parbhani": "परभणी",
            "Pune": "पुणे",
            "Raigad": "रायगड",
            "Ratnagiri": "रत्नागिरी",
            "Sangli": "सांगली",
            "Satara": "सातारा",
            "Sindhudurg": "सिंधुदुर्ग",
            "Solapur": "सोलापूर",
            "Thane": "ठाणे",
            "Wardha": "वर्धा",
            "Washim": "वाशिम",
            "Yavatmal": "यवतमाळ",
            "Rahuri": "राहुरी",
            "Rahata": "राहाता",
            "Shrirampur": "श्रीरामपूर",
            "Sangamner": "संगमनेर",
            "Haveli": "हवेली",
            "Baramati": "बारामती",
            "Junnar": "जुन्नर",
            "Niphad": "निफाड",
            "Sinnar": "सिन्नर",
            "Yeola": "येवला",
            "Sample Village": "नमुना गाव",
            "Savedi": "सावेडी",
            "Kedgaon": "केडगाव",
            "Burudgaon": "बुरुडगाव",
            "Location List": "ठिकाणांची यादी",
            "Sr. No.": "अनुक्रमांक",
            "District": "जिल्हा",
            "Taluka": "तालुका",
            "Village": "गाव",
            "Status": "स्थिती",
            "Active": "सक्रिय",
            "Inactive": "निष्क्रिय",
            "Back": "मागे",






            // 4. Sales and User Reports - Marathi

            "Sales and User Reports": "विक्री आणि वापरकर्ता अहवाल",
            "Monitor marketplace sales and registered users.": "मार्केटप्लेसमधील विक्री आणि नोंदणीकृत वापरकर्त्यांवर लक्ष ठेवा.",
            "Back": "मागे",
            "Total Sales": "एकूण विक्री",
            "Overall marketplace sales": "मार्केटप्लेसची एकूण विक्री",
            "Total Orders": "एकूण ऑर्डर्स",
            "Orders received": "प्राप्त झालेल्या ऑर्डर्स",
            "Total Farmers": "एकूण शेतकरी",
            "Registered farmers": "नोंदणीकृत शेतकरी",
            "Total Buyers": "एकूण खरेदीदार",
            "Registered buyers": "नोंदणीकृत खरेदीदार",
            "Filter Reports": "अहवाल फिल्टर करा",
            "Report Type": "अहवालाचा प्रकार",
            "Sales Report": "विक्री अहवाल",
            "User Report": "वापरकर्ता अहवाल",
            "From Date": "या तारखेपासून",
            "To Date": "या तारखेपर्यंत",
            "Status": "स्थिती",
            "All Statuses": "सर्व स्थिती",
            "Completed": "पूर्ण",
            "Pending": "प्रलंबित",
            "Cancelled": "रद्द",
            "Active": "सक्रिय",
            "Inactive": "निष्क्रिय",
            "Apply Filters": "फिल्टर लागू करा",
            "Summary of marketplace transactions.": "मार्केटप्लेसमधील व्यवहारांचा सारांश.",
            "Excel": "एक्सेल",
            "PDF": "पीडीएफ",
            "Sr. No.": "अनुक्रमांक",
            "Order ID": "ऑर्डर क्रमांक",
            "Date": "दिनांक",
            "Buyer": "खरेदीदार",
            "Farmer": "शेतकरी",
            "Amount": "रक्कम",
            "No sales records available.": "विक्रीची कोणतीही नोंद उपलब्ध नाही.",
            "Registered users and account status.": "नोंदणीकृत वापरकर्ते आणि खात्याची स्थिती.",
            "User Name": "वापरकर्त्याचे नाव",
            "Email": "ईमेल",
            "Role": "भूमिका",
            "Registration Date": "नोंदणी दिनांक",
            "No user records available.": "वापरकर्त्यांच्या कोणत्याही नोंदी उपलब्ध नाहीत.",






            // 5. Profile & Settings


            "Profile & Settings": "प्रोफाइल आणि सेटिंग्ज",
            "Manage your account, marketplace and system preferences.": "तुमचे खाते, मार्केटप्लेस आणि सिस्टमची प्राधान्ये व्यवस्थापित करा.",
            "Admin Account": "अॅडमिन खाते",
            "Profile": "प्रोफाइल",
            "Security": "सुरक्षा",
            "Admins": "अॅडमिन",
            "General": "सामान्य",
            "Notifications": "सूचना",
            "Marketplace": "मार्केटप्लेस",
            "Activity Log": "क्रियाकलाप नोंद",
            "Backup": "बॅकअप",
            "Email & SMS": "ईमेल आणि SMS",
            "System Info": "सिस्टम माहिती",

            // Admin Profile
            "Admin Profile": "अॅडमिन प्रोफाइल",
            "Full Name": "पूर्ण नाव",
            "Email Address": "ईमेल पत्ता",
            "Mobile Number": "मोबाईल नंबर",
            "Role": "भूमिका",
            "Save Profile": "प्रोफाइल जतन करा",

            // Security
            "Security Settings": "सुरक्षा सेटिंग्ज",
            "Current Password": "सध्याचा पासवर्ड",
            "New Password": "नवीन पासवर्ड",
            "Confirm New Password": "नवीन पासवर्डची पुष्टी करा",
            "Two-Factor Authentication": "दुहेरी प्रमाणीकरण",
            "Change Password": "पासवर्ड बदला",
            "Logout": "लॉगआउट",

            // Admin Management
            "Admin Management": "अॅडमिन व्यवस्थापन",
            "Admin Name": "अॅडमिनचे नाव",
            "Admin Email": "अॅडमिन ईमेल",
            "Assign Role": "भूमिका नियुक्त करा",
            "Super Admin": "सुपर अॅडमिन",
            "Support Admin": "सपोर्ट अॅडमिन",
            "Report Viewer": "अहवाल पाहणारा",
            "Account Status": "खात्याची स्थिती",
            "Inactive": "निष्क्रिय",
            "Add Admin": "अॅडमिन जोडा",

            // General Settings
            "General Settings": "सामान्य सेटिंग्ज",
            "Website Name": "वेबसाइटचे नाव",
            "Language": "भाषा",
            "Date Format": "तारखेचे स्वरूप",
            "Appearance": "दिसण्याची पद्धत",
            "Light Mode": "लाइट मोड",
            "Dark Mode": "डार्क मोड",
            "Save General Settings": "सामान्य सेटिंग्ज जतन करा",

            // Notification Settings
            "Notification Settings": "सूचना सेटिंग्ज",
            "New User Registrations": "नवीन वापरकर्ता नोंदणी",
            "New Orders": "नवीन ऑर्डर्स",
            "Farmer Complaints": "शेतकऱ्यांच्या तक्रारी",
            "Email Notifications": "ईमेल सूचना",
            "In-App Notifications": "अॅपमधील सूचना",
            "Save Notification Settings": "सूचना सेटिंग्ज जतन करा",

            // Marketplace Configuration
            "Marketplace Configuration": "मार्केटप्लेस कॉन्फिगरेशन",
            "Platform Commission (%)": "प्लॅटफॉर्म कमिशन (%)",
            "Minimum Order Quantity": "किमान ऑर्डर प्रमाण",
            "Product Approval": "उत्पादन मंजुरी",
            "Manual Admin Approval": "अॅडमिनकडून मॅन्युअल मंजुरी",
            "Automatic Approval": "स्वयंचलित मंजुरी",
            "Payment Configuration": "पेमेंट कॉन्फिगरेशन",
            "Cash on Delivery": "डिलिव्हरीवेळी पेमेंट",
            "Online Payment": "ऑनलाइन पेमेंट",
            "Both": "दोन्ही",
            "Save Marketplace Settings": "मार्केटप्लेस सेटिंग्ज जतन करा",

            // Activity Log
            "Activity": "क्रियाकलाप",
            "Performed By": "क्रिया करणारा",
            "Date & Time": "दिनांक आणि वेळ",
            "No records": "कोणतीही नोंद नाही",

            // Backup & Restore
            "Backup & Restore": "बॅकअप आणि पुनर्संचयित करा",
            "Database Backup": "डेटाबेस बॅकअप",
            "Create Backup": "बॅकअप तयार करा",
            "Select Backup File": "बॅकअप फाइल निवडा",
            "Restore Backup": "बॅकअप पुनर्संचयित करा",

            // Email & SMS
            "Email & SMS Configuration": "ईमेल आणि SMS कॉन्फिगरेशन",
            "Sender Email": "पाठवणाऱ्याचा ईमेल",
            "Email Service": "ईमेल सेवा",
            "SMTP": "SMTP",
            "Email API Provider": "ईमेल API सेवा प्रदाता",
            "SMS Provider": "SMS सेवा प्रदाता",
            "Support Contact Email": "सपोर्ट संपर्क ईमेल",
            "Save Communication Settings": "संवाद सेटिंग्ज जतन करा",

            // System Information
            "System Information": "सिस्टम माहिती",
            "Application": "अॅप्लिकेशन",
            "Application Version": "अॅप्लिकेशन आवृत्ती",
            "Database Status": "डेटाबेस स्थिती",
            "Server Status": "सर्व्हर स्थिती",
            "Not Connected to Status API": "स्टेटस API शी जोडलेले नाही",



           //manage-categoris to manage-orders
           
           
            "Category Management": "श्रेणी व्यवस्थापन",
            "Manage Categories": "श्रेणी व्यवस्थापित करा",
            "Organize and manage marketplace product categories.": "बाजारपेठेतील उत्पादनांच्या श्रेणी व्यवस्थित करा आणि व्यवस्थापित करा.",
            "Export Categories": "श्रेणी निर्यात करा",
            "Add Category": "श्रेणी जोडा",
            "All marketplace categories": "बाजारपेठेतील सर्व श्रेणी",
            "Visible in marketplace": "बाजारपेठेत दिसणाऱ्या",
            "Hidden from marketplace": "बाजारपेठेत लपवलेल्या",
            "Product Types": "उत्पादनांचे प्रकार",
            "Unique categories listed": "नोंदवलेल्या स्वतंत्र श्रेणी",
            "Category List": "श्रेणी यादी",
            "Create, update and control marketplace categories.": "बाजारपेठेतील श्रेणी तयार करा, अद्ययावत करा आणि नियंत्रित करा.",
            "Records": "नोंदी",
            "Search category name or description...": "श्रेणीचे नाव किंवा वर्णन शोधा...",
            "All Statuses": "सर्व स्थिती",
            "Active": "सक्रिय",
            "Inactive": "निष्क्रिय",
            "Reset": "रीसेट",
            "Category": "श्रेणी",
            "Description": "वर्णन",
            "Slug": "स्लग",
            "Products": "उत्पादने",
            "Created Date": "तयार केल्याची तारीख",
            "Status": "स्थिती",
            "Actions": "कृती",
            "Edit": "संपादित करा",
            "Delete": "हटवा",
            "Deactivate": "निष्क्रिय करा",
            "Activate": "सक्रिय करा",
            "No categories found": "कोणत्याही श्रेणी आढळल्या नाहीत",
            "Try changing your search or filters.": "शोध किंवा फिल्टर बदलून पहा.",
            "Sample records for frontend demonstration": "फ्रंटएंड प्रात्यक्षिकासाठी नमुना नोंदी",
            "Category Settings": "श्रेणी सेटिंग्ज",
            "Add New Category": "नवीन श्रेणी जोडा",
            "Edit Category": "श्रेणी संपादित करा",
            "Category Name": "श्रेणीचे नाव",
            "Enter category name": "श्रेणीचे नाव लिहा",
            "Enter category description": "श्रेणीचे वर्णन लिहा",
            "Icon": "चिन्ह",
            "The category slug is generated automatically from its name.": "श्रेणीच्या नावावरून स्लग आपोआप तयार होतो.",
            "Cancel": "रद्द करा",
            "Save Category": "श्रेणी जतन करा",
            "Update Category": "श्रेणी अद्ययावत करा",
            "Category added successfully.": "श्रेणी यशस्वीरीत्या जोडली.",
            "Category updated successfully.": "श्रेणी यशस्वीरीत्या अद्ययावत केली.",
            "Delete this category?": "ही श्रेणी हटवायची आहे का?",
            "Category deleted successfully.": "श्रेणी यशस्वीरीत्या हटवली.",
            "Change category status?": "श्रेणीची स्थिती बदलायची आहे का?",
            "Category status updated.": "श्रेणीची स्थिती अद्ययावत केली.",
            "A category with this name already exists.": "या नावाची श्रेणी आधीपासून अस्तित्वात आहे.",
            "Category name is required.": "श्रेणीचे नाव आवश्यक आहे.",
            "Showing": "दाखवत आहे",
            "categories": "श्रेणी",
            "Export category records": "श्रेणीच्या नोंदी निर्यात करा",
            "No categories to export.": "निर्यात करण्यासाठी श्रेणी नाहीत.",


            "Export Products": "उत्पादने निर्यात करा",
            "Total Products": "एकूण उत्पादने",
            "Products submitted by farmers": "शेतकऱ्यांनी सादर केलेली उत्पादने",
            "Pending Approval": "मंजुरी प्रलंबित",
            "Waiting for admin review": "प्रशासकाच्या तपासणीच्या प्रतीक्षेत",
            "Approved Products": "मंजूर उत्पादने",
            "Available for buyers": "खरेदीदारांसाठी उपलब्ध",
            "Rejected Products": "नाकारलेली उत्पादने",
            "Products not approved": "मंजुरी न मिळालेली उत्पादने",
            "Product Verification": "उत्पादन पडताळणी",
            "Check product details, quantity, price and farmer information before approving a listing.": "उत्पादन मंजूर करण्यापूर्वी त्याची माहिती, प्रमाण, किंमत आणि शेतकऱ्याची माहिती तपासा.",
            "Product Approval List": "उत्पादन मंजुरी यादी",
            "Review and manage submitted marketplace products.": "बाजारपेठेसाठी सादर केलेली उत्पादने तपासा आणि व्यवस्थापित करा.",
            "Records": "नोंदी",
            "Search product, farmer or location...": "उत्पादन, शेतकरी किंवा ठिकाण शोधा...",
            "All Categories": "सर्व श्रेणी",
            "Product": "उत्पादन",
            "Farmer": "शेतकरी",
            "Category": "श्रेणी",
            "Quantity": "प्रमाण",
            "Price": "किंमत",
            "Approved": "मंजूर",
            "View product": "उत्पादन पहा",
            "Approve product": "उत्पादन मंजूर करा",
            "Reject product": "उत्पादन नाकारा",
            "No products found": "कोणतीही उत्पादने आढळली नाहीत",
            "Try changing your search or filters.": "शोध किंवा फिल्टर बदलून पहा.",
            "Showing 8 products": "८ उत्पादने दाखवत आहे",
            "Sample records for frontend demonstration": "फ्रंटएंड प्रात्यक्षिकासाठी नमुना नोंदी",
            "Product Details": "उत्पादनाची माहिती",
            "Location": "ठिकाण",
            "Close": "बंद करा",
            "Approve this product?": "हे उत्पादन मंजूर करायचे आहे का?",
            "Reject this product?": "हे उत्पादन नाकारायचे आहे का?",
            "Product approved successfully. This is a frontend-only change.": "उत्पादन यशस्वीरीत्या मंजूर केले. हा बदल फक्त फ्रंटएंडवर आहे.",
            "Product rejected. This is a frontend-only change.": "उत्पादन नाकारले. हा बदल फक्त फ्रंटएंडवर आहे.",
            "Product status updated.": "उत्पादनाची स्थिती बदलली.",
            "All products": "सर्व उत्पादने",
            "Showing": "दाखवत आहे",
            "products": "उत्पादने",
            "Export product records": "उत्पादनांच्या नोंदी निर्यात करा",
            "No products to export.": "निर्यात करण्यासाठी उत्पादने नाहीत.",



            "Order Management": "ऑर्डर व्यवस्थापन",
            "Manage Orders": "ऑर्डर व्यवस्थापित करा",
            "Track, review and manage marketplace orders.": "बाजारपेठेतील ऑर्डर तपासा आणि व्यवस्थापित करा.",
            "Export Orders": "ऑर्डर निर्यात करा",
            "Total Orders": "एकूण ऑर्डर",
            "All marketplace orders": "बाजारपेठेतील सर्व ऑर्डर",
            "Pending Orders": "प्रलंबित ऑर्डर",
            "Awaiting confirmation": "पुष्टीची प्रतीक्षा",
            "Processing Orders": "प्रक्रियेत असलेल्या ऑर्डर",
            "Being prepared or shipped": "तयार होत आहेत किंवा पाठवण्यात आल्या आहेत",
            "Completed Orders": "पूर्ण झालेल्या ऑर्डर",
            "Successfully delivered": "यशस्वीरीत्या वितरित",
            "Orders List": "ऑर्डर यादी",
            "View and update customer order information.": "ग्राहकांच्या ऑर्डरची माहिती पहा आणि अद्ययावत करा.",
            "Records": "नोंदी",
            "Search order, buyer or product...": "ऑर्डर, खरेदीदार किंवा उत्पादन शोधा...",
            "All Statuses": "सर्व स्थिती",
            "Pending": "प्रलंबित",
            "Confirmed": "पुष्टी झालेली",
            "Processing": "प्रक्रियेत",
            "Shipped": "पाठवलेली",
            "Delivered": "वितरित",
            "Cancelled": "रद्द केलेली",
            "Reset": "रीसेट",
            "Order ID": "ऑर्डर क्रमांक",
            "Buyer": "खरेदीदार",
            "Product": "उत्पादन",
            "Quantity": "प्रमाण",
            "Total Amount": "एकूण रक्कम",
            "Order Date": "ऑर्डरची तारीख",
            "Status": "स्थिती",
            "Actions": "कृती",
            "View Order": "ऑर्डर पहा",
            "No orders found": "कोणतीही ऑर्डर आढळली नाही",
            "Try changing your search or filters.": "शोध किंवा फिल्टर बदलून पहा.",
            "Sample records for frontend demonstration": "फ्रंटएंड प्रात्यक्षिकासाठी नमुना नोंदी",
            "Order Details": "ऑर्डरची माहिती",
            "Email": "ईमेल",
            "Phone": "फोन",
            "Delivery Location": "वितरणाचे ठिकाण",
            "Close": "बंद करा",
            "Showing": "दाखवत आहे",
            "orders": "ऑर्डर",
            "Order status updated successfully.": "ऑर्डरची स्थिती यशस्वीरीत्या अद्ययावत केली.",
            "Export order records": "ऑर्डरच्या नोंदी निर्यात करा",
            "No orders to export.": "निर्यात करण्यासाठी ऑर्डर नाहीत.",
            "Confirm status change?": "ऑर्डरची स्थिती बदलायची आहे का?",


            "Enquiry Management": "चौकशी व्यवस्थापन",
            "Manage Enquiries": "चौकशी व्यवस्थापित करा",
            "Review and manage buyer enquiries submitted for farmer products.": "शेतमालासाठी खरेदीदारांनी पाठवलेल्या चौकशी तपासा आणि व्यवस्थापित करा.",
            "Export Enquiries": "चौकशी निर्यात करा",
            "Total Enquiries": "एकूण चौकशी",
            "All submitted enquiries": "सर्व सादर केलेल्या चौकशी",
            "Pending Enquiries": "प्रलंबित चौकशी",
            "Waiting for review": "तपासणीच्या प्रतीक्षेत",
            "Accepted Enquiries": "स्वीकारलेल्या चौकशी",
            "Approved by farmers": "शेतकऱ्यांनी स्वीकारलेल्या",
            "Rejected Enquiries": "नाकारलेल्या चौकशी",
            "Declined enquiries": "नाकारलेल्या चौकशी",
            "Enquiry List": "चौकशी यादी",
            "Review buyer requests and track their current status.": "खरेदीदारांच्या विनंत्या तपासा आणि त्यांची स्थिती पहा.",
            "Records": "नोंदी",
            "Search buyer, product or enquiry ID...": "खरेदीदार, उत्पादन किंवा चौकशी क्रमांक शोधा...",
            "All Statuses": "सर्व स्थिती",
            "Pending": "प्रलंबित",
            "Accepted": "स्वीकारलेली",
            "Rejected": "नाकारलेली",
            "All Categories": "सर्व श्रेणी",
            "Vegetables": "भाज्या",
            "Fruits": "फळे",
            "Grains": "धान्य",
            "Pulses": "कडधान्ये",
            "Reset": "रीसेट",
            "Enquiry ID": "चौकशी क्रमांक",
            "Buyer": "खरेदीदार",
            "Product": "उत्पादन",
            "Farmer": "शेतकरी",
            "Requested Quantity": "मागणी केलेले प्रमाण",
            "Offered Price": "प्रस्तावित किंमत",
            "Date": "तारीख",
            "Status": "स्थिती",
            "Actions": "कृती",
            "View Enquiry": "चौकशी पहा",
            "Accept Enquiry": "चौकशी स्वीकारा",
            "Reject Enquiry": "चौकशी नाकारा",
            "No enquiries found": "कोणतीही चौकशी आढळली नाही",
            "Try changing your search or filters.": "शोध किंवा फिल्टर बदलून पहा.",
            "Sample records for frontend demonstration": "फ्रंटएंड प्रात्यक्षिकासाठी नमुना नोंदी",
            "Enquiry Details": "चौकशीची माहिती",
            "Email": "ईमेल",
            "Phone": "फोन",
            "Location": "ठिकाण",
            "Buyer Message": "खरेदीदाराचा संदेश",
            "Close": "बंद करा",
            "Showing": "दाखवत आहे",
            "enquiries": "चौकशी",
            "Confirm Accept": "ही चौकशी स्वीकारायची आहे का?",
            "Confirm Reject": "ही चौकशी नाकारायची आहे का?",
            "Enquiry accepted successfully.": "चौकशी यशस्वीरीत्या स्वीकारली.",
            "Enquiry rejected successfully.": "चौकशी यशस्वीरीत्या नाकारली.",
            "Export enquiry records": "चौकशीच्या नोंदी निर्यात करा",
            "No enquiries to export.": "निर्यात करण्यासाठी चौकशी नाहीत."













        }
    };

    function translateAdminPage(language) {
        const dictionary = translations[language];

        if (!dictionary) return;

        // Translate elements marked for translation.
        document.querySelectorAll("[data-translate]").forEach(function (element) {
            const key = element.dataset.translate;

            if (dictionary[key]) {
                element.textContent = dictionary[key];
            }
        });

        // Translate placeholders.
        document.querySelectorAll("[data-translate-placeholder]").forEach(
            function (element) {
                const key = element.dataset.translatePlaceholder;

                if (dictionary[key]) {
                    element.placeholder = dictionary[key];
                }
            }
        );

        // Translate the admin sidebar.
        document.querySelectorAll(".admin-nav-link span").forEach(function (element) {
            const englishText = element.dataset.englishText ||
                element.textContent.trim();

            if (!element.dataset.englishText) {
                element.dataset.englishText = englishText;
            }

            element.textContent =
                dictionary[element.dataset.englishText] ||
                element.dataset.englishText;
        });

        // Update language button.
        if (currentLanguageLabel) {
            currentLanguageLabel.textContent =
                language === "mr" ? "मराठी" : "English";
        }

        // Highlight selected language.
        languageOptions.forEach(function (option) {
            option.classList.toggle(
                "active",
                option.dataset.lang === language
            );
        });

        // Remember the selection while navigating admin pages.
        try {
            sessionStorage.setItem("kisansetuAdminLanguage", language);
        } catch (error) {
            // The language switch still works if session storage is unavailable.
        }

        document.documentElement.lang = language === "mr" ? "mr" : "en";
    }

    languageOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            translateAdminPage(option.dataset.lang);
        });
    });

    // Restore the selected language when a page loads.
    let savedAdminLanguage = "en";

    try {
        savedAdminLanguage =
            sessionStorage.getItem("kisansetuAdminLanguage") || "en";
    } catch (error) {
        savedAdminLanguage = "en";
    }

    translateAdminPage(savedAdminLanguage);
    // ==========================================
    // Statistics Page Functionality
    // ==========================================

    const refreshStatsBtn = document.getElementById("refreshStatsBtn");
    const reportGeneratedAt = document.getElementById("reportGeneratedAt");

    function updateReportTime() {
        if (reportGeneratedAt) {
            reportGeneratedAt.textContent = new Date().toLocaleString();
        }
    }

    // Show report generation time
    updateReportTime();

    // Refresh report timestamp
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener("click", function () {
            updateReportTime();
        });
    }

    // User distribution chart
    const userChartCanvas = document.getElementById("userDistributionChart");

    if (userChartCanvas && typeof Chart !== "undefined") {
        new Chart(userChartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Farmers", "Buyers"],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ["#198754", "#8bcf9b"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }

    // Marketplace chart
    const marketplaceCanvas = document.getElementById("marketplaceChart");

    if (marketplaceCanvas && typeof Chart !== "undefined") {
        new Chart(marketplaceCanvas, {
            type: "bar",
            data: {
                labels: ["Products", "Orders", "Completed Orders"],
                datasets: [{
                    label: "Total",
                    data: [0, 0, 0],
                    backgroundColor: ["#198754", "#65b981", "#b8e3c5"],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    // ==========================================
    // Manage Buyers - Frontend Functionality
    // ==========================================

    const buyerSearchInput = document.getElementById("buyerSearchInput");
    const buyerStatusFilter = document.getElementById("buyerStatusFilter");
    const resetBuyerFiltersBtn = document.getElementById("resetBuyerFiltersBtn");
    const buyersTableBody = document.getElementById("buyersTableBody");
    const buyersEmptyState = document.getElementById("buyersEmptyState");
    const buyersRecordCount = document.getElementById("buyersRecordCount");
    const buyersPaginationInfo = document.getElementById("buyersPaginationInfo");

    function filterBuyers() {
        if (!buyersTableBody) return;

        const searchText = buyerSearchInput
            ? buyerSearchInput.value.trim().toLowerCase()
            : "";

        const selectedStatus = buyerStatusFilter
            ? buyerStatusFilter.value
            : "all";

        const rows = Array.from(buyersTableBody.querySelectorAll("tr"));
        let visibleCount = 0;

        rows.forEach(function (row) {
            const rowText = row.textContent.toLowerCase();
            const rowStatus = row.dataset.status;

            const matchesSearch = rowText.includes(searchText);
            const matchesStatus =
                selectedStatus === "all" || rowStatus === selectedStatus;

            const shouldShow = matchesSearch && matchesStatus;

            row.classList.toggle("d-none", !shouldShow);

            if (shouldShow) visibleCount++;
        });

        if (buyersRecordCount) {
            buyersRecordCount.textContent = visibleCount;
        }

        if (buyersPaginationInfo) {
            buyersPaginationInfo.textContent =
                visibleCount > 0
                    ? "Showing 1–" + visibleCount + " of " + visibleCount + " sample records"
                    : "Showing 0 records";
        }

        if (buyersEmptyState) {
            buyersEmptyState.classList.toggle("d-none", visibleCount !== 0);
        }
    }

    if (buyerSearchInput) {
        buyerSearchInput.addEventListener("input", filterBuyers);
    }

    if (buyerStatusFilter) {
        buyerStatusFilter.addEventListener("change", filterBuyers);
    }

    if (resetBuyerFiltersBtn) {
        resetBuyerFiltersBtn.addEventListener("click", function () {
            if (buyerSearchInput) buyerSearchInput.value = "";
            if (buyerStatusFilter) buyerStatusFilter.value = "all";

            filterBuyers();
        });
    }

    // Buyer details modal
    document.querySelectorAll(".view-buyer-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const name = button.dataset.buyer || "Buyer";
            const email = button.dataset.email || "--";
            const mobile = button.dataset.mobile || "--";
            const date = button.dataset.date || "--";
            const orders = button.dataset.orders || "0";
            const status = button.dataset.status || "Active";

            const modal = document.getElementById("buyerDetailsModal");

            if (!modal || typeof bootstrap === "undefined") return;

            const setText = function (id, value) {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            };

            setText("modalBuyerName", name);
            setText("modalBuyerEmail", email);
            setText("modalBuyerMobile", mobile);
            setText("modalBuyerDate", date);
            setText("modalBuyerOrders", orders);
            setText(
                "modalBuyerAvatar",
                name.split(" ").map(function (part) {
                    return part.charAt(0);
                }).join("").substring(0, 2).toUpperCase()
            );

            const statusElement = document.getElementById("modalBuyerStatus");

            if (statusElement) {
                statusElement.textContent = status;
                statusElement.className = "buyer-status status-" +
                    status.toLowerCase();
            }

            bootstrap.Modal.getOrCreateInstance(modal).show();
        });
    });

    // Export visible buyer records to CSV
    const exportBuyersBtn = document.getElementById("exportBuyersBtn");

    if (exportBuyersBtn && buyersTableBody) {
        exportBuyersBtn.addEventListener("click", function () {
            const visibleRows = Array.from(
                buyersTableBody.querySelectorAll("tr:not(.d-none)")
            );

            if (visibleRows.length === 0) {
                alert("There are no buyer records to export.");
                return;
            }

            const csvCell = function (value) {
                return '"' + value.replace(/"/g, '""') + '"';
            };

            const csvData = [
                ["Buyer Name", "Email", "Mobile", "Registered On", "Total Orders", "Status"]
            ];

            visibleRows.forEach(function (row) {
                const cells = row.querySelectorAll("td");

                csvData.push([
                    cells[0].querySelector("h6")?.textContent.trim() || "",
                    cells[0].querySelector("span")?.textContent.trim() || "",
                    cells[1]?.textContent.trim() || "",
                    cells[2]?.textContent.trim() || "",
                    cells[3]?.textContent.trim() || "",
                    cells[4]?.textContent.trim() || ""
                ]);
            });

            const csvContent = csvData.map(function (row) {
                return row.map(function (value) {
                    return csvCell(value);
                }).join(",");
            }).join("\r\n");

            const blob = new Blob(["\uFEFF" + csvContent], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "kisansetu-buyers.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        });
    }

    // Edit buttons are design placeholders for now.
    document.querySelectorAll(".edit-buyer-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            alert("Buyer editing will be implemented later.");
        });
    });
    // ==========================================
    // Manage Farmers - Frontend Functionality
    // ==========================================

    const farmerSearchInput = document.getElementById("farmerSearchInput");
    const farmerStatusFilter = document.getElementById("farmerStatusFilter");
    const farmerKycFilter = document.getElementById("farmerKycFilter");
    const resetFarmerFiltersBtn = document.getElementById("resetFarmerFiltersBtn");
    const farmersTableBody = document.getElementById("farmersTableBody");
    const farmersEmptyState = document.getElementById("farmersEmptyState");
    const farmersRecordCount = document.getElementById("farmersRecordCount");
    const farmersPaginationInfo = document.getElementById("farmersPaginationInfo");

    function filterFarmers() {
        if (!farmersTableBody) return;

        const searchText = farmerSearchInput
            ? farmerSearchInput.value.trim().toLowerCase()
            : "";

        const selectedStatus = farmerStatusFilter
            ? farmerStatusFilter.value
            : "all";

        const selectedKyc = farmerKycFilter
            ? farmerKycFilter.value
            : "all";

        const rows = Array.from(farmersTableBody.querySelectorAll("tr"));
        let visibleCount = 0;

        rows.forEach(function (row) {
            const rowText = row.textContent.toLowerCase();
            const rowStatus = row.dataset.status;
            const rowKyc = row.dataset.kyc;

            const matchesSearch = rowText.includes(searchText);
            const matchesStatus =
                selectedStatus === "all" || rowStatus === selectedStatus;
            const matchesKyc =
                selectedKyc === "all" || rowKyc === selectedKyc;

            const shouldShow =
                matchesSearch && matchesStatus && matchesKyc;

            row.classList.toggle("d-none", !shouldShow);

            if (shouldShow) visibleCount++;
        });

        if (farmersRecordCount) {
            farmersRecordCount.textContent = visibleCount;
        }

        if (farmersPaginationInfo) {
            farmersPaginationInfo.textContent = visibleCount > 0
                ? "Showing 1–" + visibleCount + " of " + visibleCount + " sample records"
                : "Showing 0 records";
        }

        if (farmersEmptyState) {
            farmersEmptyState.classList.toggle("d-none", visibleCount !== 0);
        }
    }

    if (farmerSearchInput) {
        farmerSearchInput.addEventListener("input", filterFarmers);
    }

    if (farmerStatusFilter) {
        farmerStatusFilter.addEventListener("change", filterFarmers);
    }

    if (farmerKycFilter) {
        farmerKycFilter.addEventListener("change", filterFarmers);
    }

    if (resetFarmerFiltersBtn) {
        resetFarmerFiltersBtn.addEventListener("click", function () {
            if (farmerSearchInput) farmerSearchInput.value = "";
            if (farmerStatusFilter) farmerStatusFilter.value = "all";
            if (farmerKycFilter) farmerKycFilter.value = "all";

            filterFarmers();
        });
    }

    // View farmer details
    document.querySelectorAll(".view-farmer-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const name = button.dataset.name || "Farmer";
            const email = button.dataset.email || "--";
            const mobile = button.dataset.mobile || "--";
            const location = button.dataset.location || "--";
            const farm = button.dataset.farm || "--";
            const kyc = button.dataset.kyc || "--";
            const status = button.dataset.status || "Active";

            const modal = document.getElementById("farmerDetailsModal");

            if (!modal || typeof bootstrap === "undefined") return;

            const setText = function (id, value) {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            };

            setText("modalFarmerName", name);
            setText("modalFarmerEmail", email);
            setText("modalFarmerMobile", mobile);
            setText("modalFarmerLocation", location);
            setText("modalFarmerFarm", farm);
            setText("modalFarmerKyc", kyc);

            setText(
                "modalFarmerAvatar",
                name.split(" ").map(function (part) {
                    return part.charAt(0);
                }).join("").substring(0, 2).toUpperCase()
            );

            const statusElement = document.getElementById("modalFarmerStatus");

            if (statusElement) {
                statusElement.textContent = status;

                const statusClass = {
                    Active: "farmer-account-active",
                    Pending: "farmer-account-pending",
                    Suspended: "farmer-account-suspended"
                };

                statusElement.className =
                    "farmer-status " + (statusClass[status] || "farmer-account-active");
            }

            bootstrap.Modal.getOrCreateInstance(modal).show();
        });
    });

    // Export visible farmer records to CSV
    const exportFarmersBtn = document.getElementById("exportFarmersBtn");

    if (exportFarmersBtn && farmersTableBody) {
        exportFarmersBtn.addEventListener("click", function () {
            const visibleRows = Array.from(
                farmersTableBody.querySelectorAll("tr:not(.d-none)")
            );

            if (visibleRows.length === 0) {
                alert("There are no farmer records to export.");
                return;
            }

            function csvCell(value) {
                return '"' + value.replace(/"/g, '""') + '"';
            }

            const csvData = [[
                "Farmer Name",
                "Email",
                "Mobile",
                "Village",
                "District",
                "Farm Size",
                "KYC Status",
                "Account Status"
            ]];

            visibleRows.forEach(function (row) {
                const cells = row.querySelectorAll("td");
                const location = cells[2];

                csvData.push([
                    cells[0].querySelector("h6")?.textContent.trim() || "",
                    cells[0].querySelector("span")?.textContent.trim() || "",
                    cells[1]?.textContent.trim() || "",
                    location?.querySelector(".farmer-location-name")?.textContent.trim() || "",
                    location?.querySelector(".farmer-location-sub")?.textContent.trim() || "",
                    cells[3]?.textContent.trim() || "",
                    cells[4]?.textContent.trim() || "",
                    cells[5]?.textContent.trim() || ""
                ]);
            });

            const csvContent = csvData.map(function (row) {
                return row.map(csvCell).join(",");
            }).join("\r\n");

            const blob = new Blob(["\uFEFF" + csvContent], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "kisansetu-farmers.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        });
    }

    // Edit button placeholder
    document.querySelectorAll(".edit-farmer-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            alert("Farmer editing will be implemented later.");
        });
    });
    // ========================================
    // KISANSETU - VERIFY KYC PAGE
    // Add inside the existing DOMContentLoaded
    // ========================================

    const kycTableBody = document.getElementById("kycTableBody");

    if (kycTableBody) {
        const kycSearchInput = document.getElementById("kycSearchInput");
        const kycStatusFilter = document.getElementById("kycStatusFilter");
        const kycDocumentFilter = document.getElementById("kycDocumentFilter");
        const resetKycFiltersBtn = document.getElementById("resetKycFiltersBtn");
        const kycEmptyState = document.getElementById("kycEmptyState");
        const kycRecordCount = document.getElementById("kycRecordCount");
        const exportKycBtn = document.getElementById("exportKycBtn");
        const kycRows = Array.from(kycTableBody.querySelectorAll("tr"));

        function updateKycSummary() {
            const counts = {
                pending: 0,
                verified: 0,
                rejected: 0
            };

            kycRows.forEach(function (row) {
                const status = row.dataset.status;

                if (Object.prototype.hasOwnProperty.call(counts, status)) {
                    counts[status]++;
                }
            });

            document.getElementById("kycTotalCount").textContent =
                kycRows.length;

            document.getElementById("kycPendingCount").textContent =
                counts.pending;

            document.getElementById("kycVerifiedCount").textContent =
                counts.verified;

            document.getElementById("kycRejectedCount").textContent =
                counts.rejected;
        }

        function filterKycApplications() {
            const searchText = kycSearchInput.value.trim().toLowerCase();
            const selectedStatus = kycStatusFilter.value;
            const selectedDocument = kycDocumentFilter.value;

            let visibleCount = 0;

            kycRows.forEach(function (row) {
                const rowText = row.textContent.toLowerCase();
                const status = row.dataset.status;
                const documentType = row.dataset.document;

                const matchesSearch = rowText.includes(searchText);
                const matchesStatus =
                    selectedStatus === "all" || status === selectedStatus;
                const matchesDocument =
                    selectedDocument === "all" ||
                    documentType === selectedDocument;

                const shouldShow =
                    matchesSearch && matchesStatus && matchesDocument;

                row.style.display = shouldShow ? "" : "none";

                if (shouldShow) {
                    visibleCount++;
                }
            });

            kycRecordCount.textContent =
                "Showing " + visibleCount + " of " + kycRows.length +
                " applications";

            kycEmptyState.style.display =
                visibleCount === 0 ? "block" : "none";
        }

        kycSearchInput.addEventListener("input", filterKycApplications);
        kycStatusFilter.addEventListener("change", filterKycApplications);
        kycDocumentFilter.addEventListener("change", filterKycApplications);

        resetKycFiltersBtn.addEventListener("click", function () {
            kycSearchInput.value = "";
            kycStatusFilter.value = "all";
            kycDocumentFilter.value = "all";

            filterKycApplications();
        });

        // View application details
        kycTableBody.addEventListener("click", function (event) {
            const viewButton = event.target.closest(".view-kyc-btn");

            if (!viewButton) {
                return;
            }

            const data = viewButton.dataset;

            document.getElementById("modalKycAvatar").textContent =
                data.name
                    .split(" ")
                    .map(function (part) {
                        return part.charAt(0);
                    })
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

            document.getElementById("modalKycName").textContent = data.name;
            document.getElementById("modalKycApplicationId").textContent =
                data.id;
            document.getElementById("modalKycMobile").textContent =
                data.mobile;
            document.getElementById("modalKycLocation").textContent =
                data.location;
            document.getElementById("modalKycDocument").textContent =
                data.document;
            document.getElementById("modalKycDate").textContent =
                data.date;
            document.getElementById("modalKycStatus").textContent =
                data.status.charAt(0).toUpperCase() + data.status.slice(1);
            document.getElementById("modalKycNote").textContent =
                data.note;

            const modalElement = document.getElementById("kycDetailsModal");

            if (window.bootstrap && bootstrap.Modal) {
                bootstrap.Modal.getOrCreateInstance(modalElement).show();
            }
        });

        // Approve or reject a pending application
        kycTableBody.addEventListener("click", function (event) {
            const approveButton = event.target.closest(".approve-kyc-btn");
            const rejectButton = event.target.closest(".reject-kyc-btn");

            if (!approveButton && !rejectButton) {
                return;
            }

            const row = event.target.closest("tr");

            if (!row || row.dataset.status !== "pending") {
                return;
            }

            const farmerName = row.querySelector(
                ".kyc-farmer-cell strong"
            ).textContent;

            const applicationId = row.querySelector(
                ".kyc-application-id"
            ).textContent;

            let newStatus;
            let remark;

            if (approveButton) {
                const confirmed = window.confirm(
                    "Approve the KYC application " +
                    applicationId + " for " + farmerName + "?"
                );

                if (!confirmed) {
                    return;
                }

                newStatus = "verified";
                remark = "Application approved";
            } else {
                const reason = window.prompt(
                    "Enter the reason for rejecting " +
                    applicationId + " (required):"
                );

                if (reason === null) {
                    return;
                }

                if (!reason.trim()) {
                    window.alert("Please enter a rejection reason.");
                    return;
                }

                const confirmed = window.confirm(
                    "Reject the KYC application for " +
                    farmerName + "?"
                );

                if (!confirmed) {
                    return;
                }

                newStatus = "rejected";
                remark = reason.trim();
            }

            // Update the sample row in the browser
            row.dataset.status = newStatus;

            const statusBadge = row.querySelector(".kyc-status");

            statusBadge.className = "kyc-status " + newStatus;
            statusBadge.textContent =
                newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

            // Save the latest status and remark for the details modal
            const viewButton = row.querySelector(".view-kyc-btn");

            if (viewButton) {
                viewButton.dataset.status = newStatus;
                viewButton.dataset.note = remark;
            }

            // Approval/rejection actions are no longer shown for this row
            const actionButtons = row.querySelector(".kyc-action-buttons");

            if (actionButtons) {
                actionButtons.querySelectorAll(
                    ".approve-kyc-btn, .reject-kyc-btn"
                ).forEach(function (button) {
                    button.remove();
                });
            }

            updateKycSummary();
            filterKycApplications();

            window.alert(
                "Application " + applicationId + " marked as " +
                newStatus + ". This is a frontend-only change."
            );
        });

        // Export all applications to CSV
        exportKycBtn.addEventListener("click", function () {
            const csvRows = [
                [
                    "Application ID",
                    "Farmer Name",
                    "Mobile",
                    "Document Type",
                    "Submitted On",
                    "Status",
                    "Location",
                    "Review Remarks"
                ]
            ];

            kycRows.forEach(function (row) {
                const viewButton = row.querySelector(".view-kyc-btn");
                const cells = row.querySelectorAll("td");

                const farmerName = cells[1]
                    .querySelector("strong").textContent.trim();

                const mobile = cells[1]
                    .querySelector("small").textContent.trim();

                const documentType =
                    row.dataset.document === "aadhaar"
                        ? "Aadhaar Card"
                        : row.dataset.document === "pan"
                            ? "PAN Card"
                            : "Voter ID";

                const submittedOn = cells[3].textContent.trim();

                csvRows.push([
                    cells[0].textContent.trim(),
                    farmerName,
                    mobile,
                    documentType,
                    submittedOn,
                    row.dataset.status,
                    viewButton ? viewButton.dataset.location : "",
                    viewButton ? viewButton.dataset.note : ""
                ]);
            });

            function escapeCsvValue(value) {
                let textValue = String(value ?? "");

                // Prevent spreadsheet formula execution for text fields
                if (/^[\s]*[=+\-@]/.test(textValue)) {
                    textValue = "'" + textValue;
                }

                return '"' + textValue.replace(/"/g, '""') + '"';
            }

            const csvContent = csvRows
                .map(function (row) {
                    return row.map(escapeCsvValue).join(",");
                })
                .join("\r\n");

            const blob = new Blob(
                ["\uFEFF" + csvContent],
                { type: "text/csv;charset=utf-8;" }
            );

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = "kisansetu-kyc-applications.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(downloadUrl);
        });

        updateKycSummary();
        filterKycApplications();
    }
});




/* ==========================================
   KISANSETU - MANAGE CATEGORIES
   Add inside existing DOMContentLoaded
========================================== */

const manageCategoriesBody = document.getElementById(
    "manageCategoriesTableBody"
);

if (manageCategoriesBody) {
    const searchInput = document.getElementById("categoriesSearchInput");
    const statusFilter = document.getElementById("categoriesStatusFilter");
    const resetButton = document.getElementById("resetCategoriesFiltersBtn");
    const exportButton = document.getElementById("exportCategoriesBtn");
    const addButton = document.getElementById("openAddCategoryBtn");
    const emptyState = document.getElementById("categoriesEmptyState");
    const visibleCount = document.getElementById("categoriesVisibleCount");
    const paginationInfo = document.getElementById("categoriesPaginationInfo");

    const totalCount = document.getElementById("totalCategoriesCount");
    const activeCount = document.getElementById("activeCategoriesCount");
    const inactiveCount = document.getElementById("inactiveCategoriesCount");
    const typesCount = document.getElementById("categoryTypesCount");

    const form = document.getElementById("categoryForm");
    const modalElement = document.getElementById("categoryFormModal");
    const modalTitle = document.getElementById("categoryFormModalTitle");
    const nameInput = document.getElementById("categoryNameInput");
    const descriptionInput = document.getElementById("categoryDescriptionInput");
    const iconInput = document.getElementById("categoryIconInput");
    const originalNameInput = document.getElementById("categoryEditOriginalName");
    const saveButton = document.getElementById("saveCategoryBtn");

    const iconClasses = {
        "fa-carrot": "category-vegetables",
        "fa-apple-whole": "category-fruits",
        "fa-wheat-awn": "category-grains",
        "fa-seedling": "category-pulses",
        "fa-droplet": "category-oilseeds",
        "fa-pepper-hot": "category-spices",
        "fa-cow": "category-dairy",
        "fa-box-open": "category-other"
    };

    let editingRow = null;

    function getCategoryLanguage() {
        return sessionStorage.getItem("kisansetuAdminLanguage") || "en";
    }

    function getCategoryText(key) {
        const language = getCategoryLanguage();

        if (
            typeof translations !== "undefined" &&
            translations[language] &&
            translations[language][key]
        ) {
            return translations[language][key];
        }

        return key;
    }

    function escapeCategoryHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function makeSlug(name) {
        return name
            .trim()
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function getCategoryRows() {
        return Array.from(manageCategoriesBody.querySelectorAll("tr"));
    }

    function getRowName(row) {
        return row.querySelector(".category-name")?.textContent.trim() || "";
    }

    function getRowDescription(row) {
        return row.querySelector(".category-description")?.textContent.trim() ||
            row.querySelector(".category-name-cell small")?.textContent.trim() || "";
    }

    function getRowSlug(row) {
        return row.querySelector(".category-slug")?.textContent.trim() || "";
    }

    function getRowCount(row) {
        return Number(row.querySelector(".category-product-count")?.textContent || 0);
    }

    function updateCategoryStatus(row, status) {
        row.dataset.status = status;

        const badge = row.querySelector(".category-status");
        if (badge) {
            badge.classList.remove("status-active", "status-inactive");

            badge.classList.add(
                status === "active" ? "status-active" : "status-inactive"
            );

            const label = status === "active" ? "Active" : "Inactive";
            badge.dataset.translate = label;
            badge.textContent = getCategoryText(label);
        }

        const toggleButton = row.querySelector(".toggle-category-btn");

        if (toggleButton) {
            const isActive = status === "active";
            const label = isActive ? "Deactivate" : "Activate";

            toggleButton.title = getCategoryText(label);
            toggleButton.dataset.translateTitle = label;
            toggleButton.innerHTML = isActive
                ? '<i class="fa-solid fa-toggle-on"></i>'
                : '<i class="fa-solid fa-toggle-off"></i>';
        }
    }

    function updateCategorySummary() {
        const rows = getCategoryRows();
        const active = rows.filter(row => row.dataset.status === "active").length;

        totalCount.textContent = rows.length;
        activeCount.textContent = active;
        inactiveCount.textContent = rows.length - active;
        typesCount.textContent = new Set(
            rows.map(row => getRowSlug(row))
        ).size;
    }

    function filterCategories() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;
        let shown = 0;

        getCategoryRows().forEach(row => {
            const searchableText = (
                row.textContent + " " + getRowSlug(row)
            ).toLowerCase();

            const matchesSearch = searchableText.includes(query);
            const matchesStatus =
                selectedStatus === "all" || row.dataset.status === selectedStatus;

            const visible = matchesSearch && matchesStatus;

            row.classList.toggle("d-none", !visible);

            if (visible) shown++;
        });

        visibleCount.textContent = shown;
        emptyState.classList.toggle("d-none", shown !== 0);

        paginationInfo.textContent =
            `${getCategoryText("Showing")} ${shown} ${getCategoryText("categories")}`;
    }

    function refreshCategories() {
        updateCategorySummary();
        filterCategories();
    }

    function getModalInstance() {
        if (!window.bootstrap || !bootstrap.Modal) {
            window.alert("Bootstrap JavaScript is required to open this form.");
            return null;
        }

        return bootstrap.Modal.getOrCreateInstance(modalElement);
    }

    function resetCategoryForm() {
        form.reset();
        originalNameInput.value = "";
        editingRow = null;

        modalTitle.textContent = getCategoryText("Add New Category");
        modalTitle.dataset.translate = "Add New Category";

        saveButton.querySelector("span").textContent =
            getCategoryText("Save Category");

        saveButton.querySelector("span").dataset.translate = "Save Category";
    }

    function openAddCategoryModal() {
        resetCategoryForm();
        getModalInstance()?.show();
    }

    function openEditCategoryModal(row) {
        editingRow = row;

        const editButton = row.querySelector(".edit-category-btn");
        const data = editButton.dataset;

        originalNameInput.value = data.name || getRowName(row);
        nameInput.value = data.name || getRowName(row);
        descriptionInput.value = data.description || getRowDescription(row);
        iconInput.value = data.icon || "fa-seedling";

        modalTitle.textContent = getCategoryText("Edit Category");
        modalTitle.dataset.translate = "Edit Category";

        saveButton.querySelector("span").textContent =
            getCategoryText("Update Category");

        saveButton.querySelector("span").dataset.translate = "Update Category";

        getModalInstance()?.show();
    }

    function updateRowData(row, name, description, icon) {
        const slug = makeSlug(name);
        const iconClass = iconClasses[icon] || "category-other";
        const oldButton = row.querySelector(".edit-category-btn");

        row.querySelector(".category-name").textContent = name;

        const descriptionPreview = row.querySelector(".category-name-cell small");
        if (descriptionPreview) {
            descriptionPreview.textContent = description;
        }

        row.querySelector(".category-description").textContent = description;
        row.querySelector(".category-slug").textContent = slug;

        const iconContainer = row.querySelector(".category-image-icon");
        iconContainer.className = `category-image-icon ${iconClass}`;
        iconContainer.innerHTML = `<i class="fa-solid ${escapeCategoryHTML(icon)}"></i>`;

        oldButton.dataset.name = name;
        oldButton.dataset.description = description;
        oldButton.dataset.slug = slug;
        oldButton.dataset.icon = icon;
    }

    function createCategoryRow(name, description, icon) {
        const slug = makeSlug(name);
        const today = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const row = document.createElement("tr");
        row.dataset.status = "active";

        const safeName = escapeCategoryHTML(name);
        const safeDescription = escapeCategoryHTML(description);
        const safeSlug = escapeCategoryHTML(slug);
        const safeIcon = escapeCategoryHTML(icon);
        const safeDate = escapeCategoryHTML(today);
        const iconClass = iconClasses[icon] || "category-other";

        row.innerHTML = `
            <td>
                <div class="category-name-cell">
                    <span class="category-image-icon ${iconClass}">
                        <i class="fa-solid ${safeIcon}"></i>
                    </span>
                    <div>
                        <strong class="category-name">${safeName}</strong>
                        <small>${safeDescription}</small>
                    </div>
                </div>
            </td>
            <td class="category-description">${safeDescription}</td>
            <td><span class="category-slug">${safeSlug}</span></td>
            <td><span class="category-product-count">0</span></td>
            <td>${safeDate}</td>
            <td><span class="category-status status-active"
                data-translate="Active">${escapeCategoryHTML(getCategoryText("Active"))}</span></td>
            <td>
                <div class="category-actions">
                    <button class="category-action-btn edit-category-btn" type="button"
                        title="${escapeCategoryHTML(getCategoryText("Edit"))}"
                        data-translate-title="Edit"
                        data-name="${safeName}" data-description="${safeDescription}"
                        data-slug="${safeSlug}" data-icon="${safeIcon}"
                        data-date="${safeDate}" data-count="0">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="category-action-btn toggle-category-btn" type="button"
                        title="${escapeCategoryHTML(getCategoryText("Deactivate"))}"
                        data-translate-title="Deactivate">
                        <i class="fa-solid fa-toggle-on"></i>
                    </button>
                    <button class="category-action-btn delete-category-btn" type="button"
                        title="${escapeCategoryHTML(getCategoryText("Delete"))}"
                        data-translate-title="Delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>`;

        return row;
    }

    // Initialize existing sample rows.
    getCategoryRows().forEach(row => {
        updateCategoryStatus(row, row.dataset.status || "active");
    });

    refreshCategories();

    // Search and status filtering.
    searchInput.addEventListener("input", filterCategories);
    statusFilter.addEventListener("change", filterCategories);

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        statusFilter.value = "all";
        filterCategories();
    });

    // Open Add Category modal.
    addButton.addEventListener("click", openAddCategoryModal);

    // Edit, activate/deactivate and delete actions.
    manageCategoriesBody.addEventListener("click", function (event) {
        const editButton = event.target.closest(".edit-category-btn");
        const toggleButton = event.target.closest(".toggle-category-btn");
        const deleteButton = event.target.closest(".delete-category-btn");

        if (editButton) {
            openEditCategoryModal(editButton.closest("tr"));
            return;
        }

        if (toggleButton) {
            const row = toggleButton.closest("tr");
            const nextStatus =
                row.dataset.status === "active" ? "inactive" : "active";

            if (!window.confirm(getCategoryText("Change category status?"))) {
                return;
            }

            updateCategoryStatus(row, nextStatus);
            refreshCategories();
            window.alert(getCategoryText("Category status updated."));
            return;
        }

        if (deleteButton) {
            const row = deleteButton.closest("tr");

            if (!window.confirm(getCategoryText("Delete this category?"))) {
                return;
            }

            row.remove();
            refreshCategories();
            window.alert(getCategoryText("Category deleted successfully."));
        }
    });

    // Save a new category or update an existing category.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const icon = iconInput.value;
        const originalName = originalNameInput.value.trim().toLowerCase();

        if (!name) {
            window.alert(getCategoryText("Category name is required."));
            nameInput.focus();
            return;
        }

        const slug = makeSlug(name);

        if (!slug) {
            window.alert(getCategoryText("Category name is required."));
            nameInput.focus();
            return;
        }

        const duplicate = getCategoryRows().some(row => {
            const currentName = getRowName(row).toLowerCase();

            if (editingRow && row === editingRow) {
                return false;
            }

            return currentName === name.toLowerCase() ||
                getRowSlug(row) === slug;
        });

        if (duplicate) {
            window.alert(getCategoryText("A category with this name already exists."));
            nameInput.focus();
            return;
        }

        if (editingRow) {
            updateRowData(editingRow, name, description, icon);
            window.alert(getCategoryText("Category updated successfully."));
        } else {
            const newRow = createCategoryRow(name, description, icon);
            manageCategoriesBody.prepend(newRow);
            window.alert(getCategoryText("Category added successfully."));
        }

        getModalInstance()?.hide();
        resetCategoryForm();
        refreshCategories();
    });

    // Reset modal state whenever it closes.
    modalElement.addEventListener("hidden.bs.modal", resetCategoryForm);

    // Export category data to CSV.
    exportButton.addEventListener("click", function () {
        const rows = getCategoryRows();

        if (!rows.length) {
            window.alert(getCategoryText("No categories to export."));
            return;
        }

        const headers = [
            "Category Name",
            "Description",
            "Slug",
            "Product Count",
            "Created Date",
            "Status"
        ];

        function escapeCSV(value) {
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
        }

        const csvRows = rows.map(row => [
            getRowName(row),
            getRowDescription(row),
            getRowSlug(row),
            getRowCount(row),
            row.querySelector("td:nth-child(5)")?.textContent.trim() || "",
            row.dataset.status
        ].map(escapeCSV).join(","));

        const csvContent = [
            headers.map(escapeCSV).join(","),
            ...csvRows
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "kisansetu-categories.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });
}


    // ==========================================
    // APPROVE PRODUCTS - FRONTEND FUNCTIONALITY
    // Add inside the existing DOMContentLoaded
    // ==========================================

    const approvalTableBody = document.getElementById(
        "approvalProductsTableBody"
    );

    if (approvalTableBody) {
        const approvalSearchInput = document.getElementById(
            "approvalSearchInput"
        );

        const approvalStatusFilter = document.getElementById(
            "approvalStatusFilter"
        );

        const approvalCategoryFilter = document.getElementById(
            "approvalCategoryFilter"
        );

        const resetApprovalFiltersBtn = document.getElementById(
            "resetApprovalFiltersBtn"
        );

        const exportProductsBtn = document.getElementById(
            "exportProductsBtn"
        );

        const approvalEmptyState = document.getElementById(
            "approvalEmptyState"
        );

        const approvalVisibleCount = document.getElementById(
            "approvalVisibleCount"
        );

        const approvalPaginationInfo = document.getElementById(
            "approvalPaginationInfo"
        );

        const approvalRows = Array.from(
            approvalTableBody.querySelectorAll("tr")
        );

        const approvalModalElement = document.getElementById(
            "approvalProductModal"
        );

        function getCurrentAdminLanguage() {
            try {
                return sessionStorage.getItem(
                    "kisansetuAdminLanguage"
                ) || "en";
            } catch (error) {
                return "en";
            }
        }

        function translateApprovalStatus(status) {
            const language = getCurrentAdminLanguage();

            const statusTranslations = {
                en: {
                    pending: "Pending",
                    approved: "Approved",
                    rejected: "Rejected"
                },
                mr: {
                    pending: "प्रलंबित",
                    approved: "मंजूर",
                    rejected: "नाकारले"
                }
            };

            return statusTranslations[language][status] || status;
        }

        function updateApprovalSummary() {
            const counts = {
                pending: 0,
                approved: 0,
                rejected: 0
            };

            approvalRows.forEach(function (row) {
                const status = row.dataset.status;

                if (Object.prototype.hasOwnProperty.call(counts, status)) {
                    counts[status]++;
                }
            });

            document.getElementById("approvalTotalCount").textContent =
                approvalRows.length;

            document.getElementById("approvalPendingCount").textContent =
                counts.pending;

            document.getElementById("approvalApprovedCount").textContent =
                counts.approved;

            document.getElementById("approvalRejectedCount").textContent =
                counts.rejected;
        }

        function filterApprovalProducts() {
            const searchText = approvalSearchInput.value
                .trim()
                .toLowerCase();

            const selectedStatus = approvalStatusFilter.value;
            const selectedCategory = approvalCategoryFilter.value;

            let visibleCount = 0;

            approvalRows.forEach(function (row) {
                const rowText = row.textContent.toLowerCase();
                const rowStatus = row.dataset.status;
                const rowCategory = row.dataset.category;

                const matchesSearch = rowText.includes(searchText);

                const matchesStatus =
                    selectedStatus === "all" ||
                    rowStatus === selectedStatus;

                const matchesCategory =
                    selectedCategory === "all" ||
                    rowCategory === selectedCategory;

                const shouldShow =
                    matchesSearch &&
                    matchesStatus &&
                    matchesCategory;

                row.classList.toggle("d-none", !shouldShow);

                if (shouldShow) {
                    visibleCount++;
                }
            });

            approvalVisibleCount.textContent = visibleCount;

            approvalPaginationInfo.textContent =
                visibleCount + " " +
                (getCurrentAdminLanguage() === "mr"
                    ? "उत्पादने दाखवत आहे"
                    : "products shown");

            approvalEmptyState.classList.toggle(
                "d-none",
                visibleCount !== 0
            );
        }

        // Search and filters
        approvalSearchInput.addEventListener(
            "input",
            filterApprovalProducts
        );

        approvalStatusFilter.addEventListener(
            "change",
            filterApprovalProducts
        );

        approvalCategoryFilter.addEventListener(
            "change",
            filterApprovalProducts
        );

        // Reset all filters
        resetApprovalFiltersBtn.addEventListener("click", function () {
            approvalSearchInput.value = "";
            approvalStatusFilter.value = "all";
            approvalCategoryFilter.value = "all";

            filterApprovalProducts();
        });

        // Product details modal
        approvalTableBody.addEventListener("click", function (event) {
            const viewButton = event.target.closest(
                ".view-approval-btn"
            );

            if (!viewButton) return;

            const data = viewButton.dataset;

            const setModalText = function (id, value) {
                const element = document.getElementById(id);

                if (element) {
                    element.textContent = value || "--";
                }
            };

            setModalText("modalApprovalProductId", data.id);
            setModalText("modalApprovalProductName", data.product);
            setModalText("modalApprovalFarmer", data.farmer);
            setModalText("modalApprovalLocation", data.location);
            setModalText("modalApprovalCategory", data.category);
            setModalText("modalApprovalQuantity", data.quantity);
            setModalText("modalApprovalPrice", data.price);
            setModalText("modalApprovalDate", data.date);
            setModalText(
                "modalApprovalStatus",
                translateApprovalStatus(data.status)
            );

            if (
                window.bootstrap &&
                bootstrap.Modal &&
                approvalModalElement
            ) {
                bootstrap.Modal
                    .getOrCreateInstance(approvalModalElement)
                    .show();
            }
        });

        // Approve or reject products
        approvalTableBody.addEventListener("click", function (event) {
            const approveButton = event.target.closest(
                ".approve-product-btn"
            );

            const rejectButton = event.target.closest(
                ".reject-product-btn"
            );

            if (!approveButton && !rejectButton) return;

            const row = event.target.closest("tr");

            if (!row || row.dataset.status !== "pending") {
                return;
            }

            const viewButton = row.querySelector(".view-approval-btn");

            const productName = viewButton
                ? viewButton.dataset.product
                : row.querySelector(".approval-product-cell strong")
                    .textContent.trim();

            const language = getCurrentAdminLanguage();

            const messages = {
                en: {
                    approveConfirm: "Approve this product: ",
                    rejectConfirm: "Reject this product: ",
                    approved: "Product approved successfully. This is a frontend-only change.",
                    rejected: "Product rejected. This is a frontend-only change."
                },
                mr: {
                    approveConfirm: "हे उत्पादन मंजूर करायचे आहे का: ",
                    rejectConfirm: "हे उत्पादन नाकारायचे आहे का: ",
                    approved: "उत्पादन मंजूर केले. हा बदल फक्त फ्रंटएंडवर आहे.",
                    rejected: "उत्पादन नाकारले. हा बदल फक्त फ्रंटएंडवर आहे."
                }
            };

            const action = approveButton ? "approved" : "rejected";

            const confirmMessage = approveButton
                ? messages[language].approveConfirm
                : messages[language].rejectConfirm;

            if (!window.confirm(confirmMessage + productName + "?")) {
                return;
            }

            row.dataset.status = action;

            if (viewButton) {
                viewButton.dataset.status = action;
            }

            // Update status badge
            const statusBadge = row.querySelector(".approval-status");

            if (statusBadge) {
                statusBadge.className = "approval-status " + action;
                statusBadge.dataset.translate =
                    action.charAt(0).toUpperCase() + action.slice(1);

                statusBadge.textContent =
                    translateApprovalStatus(action);
            }

            // Remove approval/rejection buttons after action
            row.querySelectorAll(
                ".approve-product-btn, .reject-product-btn"
            ).forEach(function (button) {
                button.remove();
            });

            // Update the table's summary and filters
            updateApprovalSummary();
            filterApprovalProducts();

            window.alert(messages[language][action]);
        });

        // Export all product records to CSV
        exportProductsBtn.addEventListener("click", function () {
            if (approvalRows.length === 0) {
                window.alert("No products to export.");
                return;
            }

            const csvRows = [[
                "Product ID",
                "Product",
                "Farmer",
                "Location",
                "Category",
                "Quantity",
                "Price",
                "Submitted On",
                "Status"
            ]];

            approvalRows.forEach(function (row) {
                const viewButton = row.querySelector(".view-approval-btn");
                const cells = row.querySelectorAll("td");

                const productCell = cells[0];
                const farmerCell = cells[1];
                const statusBadge = row.querySelector(".approval-status");

                csvRows.push([
                    viewButton ? viewButton.dataset.id : "",
                    productCell.querySelector("strong")?.textContent.trim() || "",
                    farmerCell.querySelector("strong")?.textContent.trim() || "",
                    viewButton ? viewButton.dataset.location : "",
                    row.dataset.category || "",
                    cells[3]?.textContent.trim() || "",
                    cells[4]?.textContent.trim() || "",
                    cells[5]?.textContent.trim() || "",
                    statusBadge ? statusBadge.textContent.trim() : row.dataset.status
                ]);
            });

            function escapeApprovalCsv(value) {
                let textValue = String(value ?? "");

                // Reduce spreadsheet formula injection risk.
                if (/^[\s]*[=+\-@]/.test(textValue)) {
                    textValue = "'" + textValue;
                }

                return '"' + textValue.replace(/"/g, '""') + '"';
            }

            const csvContent = csvRows.map(function (row) {
                return row.map(escapeApprovalCsv).join(",");
            }).join("\r\n");

            const blob = new Blob(
                ["\uFEFF" + csvContent],
                { type: "text/csv;charset=utf-8;" }
            );

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = "kisansetu-product-approvals.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(downloadUrl);
        });

        // Initial page state
        updateApprovalSummary();
        filterApprovalProducts();
    }


    
/* =====================================
   KISANSETU - MANAGE ORDERS
   Add inside the existing DOMContentLoaded
===================================== */

const manageOrdersBody = document.getElementById("manageOrdersTableBody");

if (manageOrdersBody) {
    const ordersSearchInput = document.getElementById("ordersSearchInput");
    const ordersStatusFilter = document.getElementById("ordersStatusFilter");
    const resetOrdersFiltersBtn = document.getElementById("resetOrdersFiltersBtn");
    const exportOrdersBtn = document.getElementById("exportOrdersBtn");
    const ordersEmptyState = document.getElementById("ordersEmptyState");
    const ordersVisibleCount = document.getElementById("ordersVisibleCount");
    const ordersPaginationInfo = document.getElementById("ordersPaginationInfo");

    const totalOrdersCount = document.getElementById("totalOrdersCount");
    const pendingOrdersCount = document.getElementById("pendingOrdersCount");
    const processingOrdersCount = document.getElementById("processingOrdersCount");
    const completedOrdersCount = document.getElementById("completedOrdersCount");

    const orderRows = Array.from(manageOrdersBody.querySelectorAll("tr"));

    const orderStatusLabels = {
        pending: "Pending",
        confirmed: "Confirmed",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled"
    };

    const orderStatusClasses = {
        pending: "status-pending",
        confirmed: "status-confirmed",
        processing: "status-processing",
        shipped: "status-shipped",
        delivered: "status-delivered",
        cancelled: "status-cancelled"
    };

    function getOrdersLanguage() {
        return (
            sessionStorage.getItem("kisansetuAdminLanguage") ||
            "en"
        );
    }

    function getOrdersDictionary() {
        const language = getOrdersLanguage();

        if (
            typeof translations !== "undefined" &&
            translations[language]
        ) {
            return translations[language];
        }

        return {};
    }

    function getOrdersText(key) {
        return getOrdersDictionary()[key] || key;
    }

    function getOrderStatus(row) {
        return row.dataset.status || "pending";
    }

    function updateOrderStatusDisplay(row, status) {
        row.dataset.status = status;

        const statusBadge = row.querySelector(".order-status");
        const statusSelect = row.querySelector(".order-status-select");

        if (statusBadge) {
            statusBadge.classList.remove(
                ...Object.values(orderStatusClasses)
            );

            statusBadge.classList.add(
                orderStatusClasses[status] || "status-pending"
            );

            statusBadge.dataset.translate = orderStatusLabels[status] || "Pending";
            statusBadge.textContent = getOrdersText(
                orderStatusLabels[status] || "Pending"
            );
        }

        if (statusSelect) {
            statusSelect.value = status;
        }

        // Keep the View Order button's status in sync.
        const viewButton = row.querySelector(".view-order-btn");

        if (viewButton) {
            viewButton.dataset.status = status;
        }
    }

    function updateOrderSummary() {
        const total = orderRows.length;

        const pending = orderRows.filter(
            row => getOrderStatus(row) === "pending"
        ).length;

        const processing = orderRows.filter(row =>
            ["processing", "shipped"].includes(getOrderStatus(row))
        ).length;

        const completed = orderRows.filter(
            row => getOrderStatus(row) === "delivered"
        ).length;

        totalOrdersCount.textContent = total;
        pendingOrdersCount.textContent = pending;
        processingOrdersCount.textContent = processing;
        completedOrdersCount.textContent = completed;
    }

    function filterManageOrders() {
        const searchTerm = (
            ordersSearchInput.value || ""
        ).trim().toLowerCase();

        const selectedStatus = ordersStatusFilter.value;

        let visibleCount = 0;

        orderRows.forEach(row => {
            const searchableText = row.textContent.toLowerCase();
            const matchesSearch = searchableText.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                getOrderStatus(row) === selectedStatus;

            const isVisible = matchesSearch && matchesStatus;

            row.classList.toggle("d-none", !isVisible);

            if (isVisible) {
                visibleCount++;
            }
        });

        ordersVisibleCount.textContent = visibleCount;

        ordersEmptyState.classList.toggle(
            "d-none",
            visibleCount !== 0
        );

        ordersPaginationInfo.textContent =
            `${getOrdersText("Showing")} ${visibleCount} ${getOrdersText("orders")}`;
    }

    // Initial status and summary setup.
    orderRows.forEach(row => {
        updateOrderStatusDisplay(row, getOrderStatus(row));
    });

    updateOrderSummary();
    filterManageOrders();

    // Search orders.
    ordersSearchInput.addEventListener("input", filterManageOrders);

    // Filter by order status.
    ordersStatusFilter.addEventListener("change", filterManageOrders);

    // Reset filters.
    resetOrdersFiltersBtn.addEventListener("click", function () {
        ordersSearchInput.value = "";
        ordersStatusFilter.value = "all";

        filterManageOrders();
    });

    // Update status from the dropdown.
    manageOrdersBody.addEventListener("change", function (event) {
        const statusSelect = event.target.closest(".order-status-select");

        if (!statusSelect) return;

        const row = statusSelect.closest("tr");
        if (!row) return;

        const previousStatus = getOrderStatus(row);
        const newStatus = statusSelect.value;

        if (!orderStatusLabels[newStatus]) {
            statusSelect.value = previousStatus;
            return;
        }

        if (previousStatus === newStatus) return;

        const confirmationMessage =
            `${getOrdersText("Confirm status change?")}\n` +
            `${getOrdersText(orderStatusLabels[previousStatus])} → ` +
            `${getOrdersText(orderStatusLabels[newStatus])}`;

        if (!window.confirm(confirmationMessage)) {
            statusSelect.value = previousStatus;
            return;
        }

        updateOrderStatusDisplay(row, newStatus);
        updateOrderSummary();
        filterManageOrders();

        window.alert(getOrdersText("Order status updated successfully."));
    });

    // View order details.
    manageOrdersBody.addEventListener("click", function (event) {
        const viewButton = event.target.closest(".view-order-btn");

        if (!viewButton) return;

        const details = {
            id: viewButton.dataset.id || "",
            product: viewButton.dataset.product || "",
            farmer: viewButton.dataset.farmer || "",
            buyer: viewButton.dataset.buyer || "",
            email: viewButton.dataset.email || "",
            phone: viewButton.dataset.phone || "",
            quantity: viewButton.dataset.quantity || "",
            amount: viewButton.dataset.amount || "0",
            date: viewButton.dataset.date || "",
            status: viewButton.dataset.status || "pending",
            address: viewButton.dataset.address || ""
        };

        document.getElementById("manageOrderDetailsTitle").textContent =
            "#" + details.id;

        document.getElementById("detailOrderProduct").textContent =
            details.product;

        document.getElementById("detailOrderFarmer").textContent =
            `${getOrdersText("Farmer")}: ${details.farmer}`;

        document.getElementById("detailOrderBuyer").textContent =
            details.buyer;

        document.getElementById("detailOrderEmail").textContent =
            details.email;

        document.getElementById("detailOrderPhone").textContent =
            details.phone;

        document.getElementById("detailOrderQuantity").textContent =
            details.quantity;

        document.getElementById("detailOrderDate").textContent =
            details.date;

        document.getElementById("detailOrderStatus").textContent =
            getOrdersText(orderStatusLabels[details.status] || "Pending");

        document.getElementById("detailOrderAddress").textContent =
            details.address;

        document.getElementById("detailOrderAmount").textContent =
            "₹" + Number(details.amount).toLocaleString("en-IN");

        const modalElement = document.getElementById(
            "manageOrderDetailsModal"
        );

        if (window.bootstrap && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalElement).show();
        } else {
            window.alert(
                getOrdersText("Order Details") + "\n" +
                details.id + "\n" +
                details.product + "\n" +
                details.buyer + "\n" +
                details.quantity + "\n" +
                "₹" + Number(details.amount).toLocaleString("en-IN")
            );
        }
    });

    // Export the complete orders list to CSV.
    exportOrdersBtn.addEventListener("click", function () {
        if (orderRows.length === 0) {
            window.alert(getOrdersText("No orders to export."));
            return;
        }

        const csvHeaders = [
            "Order ID",
            "Buyer",
            "Email",
            "Product",
            "Farmer",
            "Quantity",
            "Total Amount (INR)",
            "Order Date",
            "Status",
            "Delivery Location"
        ];

        function escapeCSV(value) {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
        }

        const csvRows = orderRows.map(row => {
            const button = row.querySelector(".view-order-btn");

            return [
                button.dataset.id,
                button.dataset.buyer,
                button.dataset.email,
                button.dataset.product,
                button.dataset.farmer,
                button.dataset.quantity,
                button.dataset.amount,
                button.dataset.date,
                getOrderStatus(row),
                button.dataset.address
            ].map(escapeCSV).join(",");
        });

        const csvContent = [
            csvHeaders.map(escapeCSV).join(","),
            ...csvRows
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const downloadURL = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = downloadURL;
        downloadLink.download = "kisansetu-orders.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        URL.revokeObjectURL(downloadURL);
    });

    /*
      The shared language switcher should call translateAdminPage(language).
      Refresh the dynamic status labels and visible count after translation.
    */
    const originalTranslateAdminPage =
        typeof translateAdminPage === "function"
            ? translateAdminPage
            : null;

    if (originalTranslateAdminPage && !window.kisanSetuOrdersTranslationWrapped) {
        window.kisanSetuOrdersTranslationWrapped = true;

        // Keep the shared translator unchanged; dynamic labels use the
        // current dictionary when the page next renders or updates.
    }
}



/* ==========================================
   KISANSETU - MANAGE ENQUIRIES
   Add inside existing DOMContentLoaded
========================================== */

const manageEnquiriesBody = document.getElementById(
    "manageEnquiriesTableBody"
);

if (manageEnquiriesBody) {
    const searchInput = document.getElementById("enquiriesSearchInput");
    const statusFilter = document.getElementById("enquiriesStatusFilter");
    const categoryFilter = document.getElementById("enquiriesCategoryFilter");
    const resetButton = document.getElementById("resetEnquiriesFiltersBtn");
    const exportButton = document.getElementById("exportEnquiriesBtn");
    const emptyState = document.getElementById("enquiriesEmptyState");
    const visibleCount = document.getElementById("enquiriesVisibleCount");
    const paginationInfo = document.getElementById("enquiriesPaginationInfo");

    const totalCount = document.getElementById("totalEnquiriesCount");
    const pendingCount = document.getElementById("pendingEnquiriesCount");
    const acceptedCount = document.getElementById("acceptedEnquiriesCount");
    const rejectedCount = document.getElementById("rejectedEnquiriesCount");

    const rows = Array.from(
        manageEnquiriesBody.querySelectorAll("tr")
    );

    const statusLabels = {
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected"
    };

    const statusClasses = {
        pending: "status-pending",
        accepted: "status-accepted",
        rejected: "status-rejected"
    };

    function getEnquiryLanguage() {
        return sessionStorage.getItem("kisansetuAdminLanguage") || "en";
    }

    function getEnquiryText(key) {
        const language = getEnquiryLanguage();

        if (
            typeof translations !== "undefined" &&
            translations[language] &&
            translations[language][key]
        ) {
            return translations[language][key];
        }

        return key;
    }

    function getStatus(row) {
        return row.dataset.status || "pending";
    }

    function updateStatusDisplay(row, status) {
        row.dataset.status = status;

        const badge = row.querySelector(".enquiry-status");
        if (badge) {
            badge.classList.remove(...Object.values(statusClasses));
            badge.classList.add(statusClasses[status]);

            badge.dataset.translate = statusLabels[status];
            badge.textContent = getEnquiryText(statusLabels[status]);
        }

        const viewButton = row.querySelector(".view-enquiry-btn");
        if (viewButton) {
            viewButton.dataset.status = status;
        }

        // Only pending enquiries can be accepted or rejected.
        const acceptButton = row.querySelector(".accept-enquiry-btn");
        const rejectButton = row.querySelector(".reject-enquiry-btn");

        if (acceptButton) {
            acceptButton.classList.toggle("d-none", status !== "pending");
        }

        if (rejectButton) {
            rejectButton.classList.toggle("d-none", status !== "pending");
        }
    }

    function updateSummary() {
        totalCount.textContent = rows.length;

        pendingCount.textContent = rows.filter(
            row => getStatus(row) === "pending"
        ).length;

        acceptedCount.textContent = rows.filter(
            row => getStatus(row) === "accepted"
        ).length;

        rejectedCount.textContent = rows.filter(
            row => getStatus(row) === "rejected"
        ).length;
    }

    function filterEnquiries() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedCategory = categoryFilter.value;

        let count = 0;

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();

            const matchesSearch = text.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                getStatus(row) === selectedStatus;

            const matchesCategory =
                selectedCategory === "all" ||
                row.dataset.category === selectedCategory;

            const visible =
                matchesSearch && matchesStatus && matchesCategory;

            row.classList.toggle("d-none", !visible);

            if (visible) count++;
        });

        visibleCount.textContent = count;
        emptyState.classList.toggle("d-none", count !== 0);

        paginationInfo.textContent =
            `${getEnquiryText("Showing")} ${count} ${getEnquiryText("enquiries")}`;
    }

    function refreshEnquiries() {
        updateSummary();
        filterEnquiries();
    }

    // Initialize the existing sample records.
    rows.forEach(row => {
        updateStatusDisplay(row, getStatus(row));
    });

    refreshEnquiries();

    // Search and filters.
    searchInput.addEventListener("input", filterEnquiries);
    statusFilter.addEventListener("change", filterEnquiries);
    categoryFilter.addEventListener("change", filterEnquiries);

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        statusFilter.value = "all";
        categoryFilter.value = "all";

        filterEnquiries();
    });

    // Accept or reject an enquiry.
    manageEnquiriesBody.addEventListener("click", function (event) {
        const acceptButton = event.target.closest(".accept-enquiry-btn");
        const rejectButton = event.target.closest(".reject-enquiry-btn");

        if (!acceptButton && !rejectButton) return;

        const button = acceptButton || rejectButton;
        const row = button.closest("tr");

        if (!row || getStatus(row) !== "pending") return;

        const action = acceptButton ? "accepted" : "rejected";

        const confirmationKey = acceptButton
            ? "Confirm Accept"
            : "Confirm Reject";

        if (!window.confirm(getEnquiryText(confirmationKey))) {
            return;
        }

        updateStatusDisplay(row, action);
        refreshEnquiries();

        const messageKey = acceptButton
            ? "Enquiry accepted successfully."
            : "Enquiry rejected successfully.";

        window.alert(getEnquiryText(messageKey));
    });

    // View enquiry details.
    manageEnquiriesBody.addEventListener("click", function (event) {
        const viewButton = event.target.closest(".view-enquiry-btn");
        if (!viewButton) return;

        const data = viewButton.dataset;

        document.getElementById("enquiryDetailsModalTitle").textContent =
            "#" + (data.id || "");

        document.getElementById("detailEnquiryProduct").textContent =
            data.product || "";

        document.getElementById("detailEnquiryCategory").textContent =
            data.category || "";

        document.getElementById("detailEnquiryBuyer").textContent =
            data.buyer || "";

        document.getElementById("detailEnquiryEmail").textContent =
            data.email || "";

        document.getElementById("detailEnquiryPhone").textContent =
            data.phone || "";

        document.getElementById("detailEnquiryFarmer").textContent =
            data.farmer || "";

        document.getElementById("detailEnquiryQuantity").textContent =
            data.quantity || "";

        document.getElementById("detailEnquiryPrice").textContent =
            `₹${Number(data.price || 0).toLocaleString("en-IN")} / ${getEnquiryText("Kg")}`;

        document.getElementById("detailEnquiryDate").textContent =
            data.date || "";

        document.getElementById("detailEnquiryLocation").textContent =
            data.location || "";

        document.getElementById("detailEnquiryMessage").textContent =
            data.message || "";

        const statusBadge = document.getElementById("detailEnquiryStatus");
        statusBadge.classList.remove(...Object.values(statusClasses));
        statusBadge.classList.add(statusClasses[data.status] || "status-pending");
        statusBadge.dataset.translate = statusLabels[data.status] || "Pending";
        statusBadge.textContent = getEnquiryText(
            statusLabels[data.status] || "Pending"
        );

        const modalElement = document.getElementById("enquiryDetailsModal");

        if (window.bootstrap && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalElement).show();
        } else {
            window.alert(
                `${data.id}\n${data.product}\n${data.buyer}\n${data.message}`
            );
        }
    });

    // Export all enquiry records to CSV.
    exportButton.addEventListener("click", function () {
        if (!rows.length) {
            window.alert(getEnquiryText("No enquiries to export."));
            return;
        }

        const headers = [
            "Enquiry ID",
            "Buyer",
            "Email",
            "Phone",
            "Product",
            "Category",
            "Farmer",
            "Requested Quantity",
            "Offered Price INR",
            "Date",
            "Status",
            "Location",
            "Message"
        ];

        function escapeCSV(value) {
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
        }

        const csvRows = rows.map(row => {
            const button = row.querySelector(".view-enquiry-btn");
            const data = button.dataset;

            return [
                data.id,
                data.buyer,
                data.email,
                data.phone,
                data.product,
                data.category,
                data.farmer,
                data.quantity,
                data.price,
                data.date,
                getStatus(row),
                data.location,
                data.message
            ].map(escapeCSV).join(",");
        });

        const csvContent = [
            headers.map(escapeCSV).join(","),
            ...csvRows
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "kisansetu-enquiries.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });
}
