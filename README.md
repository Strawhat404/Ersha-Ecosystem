# Ersha-Ecosystem a System of Urban-Farmers 

### Contributors:
- Yoseph Tesfaye *(Full-Stack Developer)*
- Eyoab Amare *(Full-Stack & Mobile Developer)*
- Abdulfetah Yishak *(Full-Stack Developer)*

---

## Project Synopsis

###  Problem Statement:
In Ethiopia and across Africa, millions of modern farmers lack direct access to markets, real-time weather data, agricultural guidance, and financial services. They often rely on middlemen, which leads to low profit margins and limited growth. There's also a significant gap in logistics, sales tracking, and credit access for farmers.

### Planned Solution:
Ersha-Ecosystem is a full-featured digital ecosystem designed to **empower farmers and streamline agriculture-to-market connections** through a centralized platform. It includes:

- A marketplace where farmers can list crops and merchants can purchase directly.
- Real-time weather updates specific to farmers' locations.
- An advisory section where experts/admins can post best practices and cultivation tips.
- Crop sales data tracking to build credit and loan profiles for farmers.
- Integration with logistics companies for product transportation.
- A digital payment gateway for secure transactions.

###  Expected Outcome:
Ersha-Ecosystem aims to:
- Boost farmers' profits by cutting out unneccesary hustles and midlemen resources.
- Digitize the agricultural value chain for traceability and scalability.
- Enable data-driven financial inclusion by recording sales for microloan analysis.
- Support national food security through smart logistics and informed planting decisions.
- Government agencies and NGOs will have access to real-time agricultural data. which helps in planning resource allocation,monitor crop trends,implement region specific intervention
- Reduce crop failures atleast by 20%

###  Fayda's Role:
Ersha-Ecosystem will integrate with Fayda's **National Digital ID system** to:
- **Verify farmer identities eKyc** during registration, reducing fraud.
- **Ensure secure transactions** between verified users.
- **Loan profile and financial identity** and agricultural subsidies via verified credit history and crop sales.
- **Government and NGO Reporting and Trust** Government and NGOs will trust systems that integrate with national infrastructure .

---

##  Project Structure

```
Ersha-Ecosystem/
├── Ersha_Ecosystem_Backend/     # Django REST API Backend
│   ├── agriculture_marketplace/ # Main Django project
│   ├── users/                   # User management & authentication
│   ├── marketplace/             # Product & marketplace functionality
│   ├── orders/                  # Order management & notifications
│   ├── core/                    # Core functionality & Fayda integration
│   ├── advisory/                # Agricultural advisory system
│   ├── news/                    # News articles & content management
│   ├── weather/                 # Weather data & forecasts
│   ├── logistics/               # Delivery tracking & logistics
│   ├── payments/                # Payment processing & gateways
│   ├── docker-compose.yml       # Docker services configuration
│   └── README.md               # Backend documentation
├── Ersha_Ecosystem_Frontend/    # React.js Frontend Application
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   └── package.json           # Frontend dependencies
└── README.md                   # This file
```

##  Current Status

###  Completed Features
- **Backend Migration**: Successfully moved all backend code from `server/` to `Ersha_Ecosystem_Backend/`
- **Advisory System Integration**: Successfully integrated agricultural advisory system from backup backend
- **Payment System**: Ethiopian payment providers M-pesa,Telebirr Currently integrated (Chapa)
- **Django REST API**: Complete backend with authentication, marketplace, order management, and advisory services
- **Docker Configuration**: Full containerization setup with PostgreSQL and Redis
- **API Documentation**: Swagger/OpenAPI documentation available
- **Frontend Foundation**: React.js application with Tailwind CSS
- **CI/CD Pipeline**: Automated testing and deployment pipeline with GitHub Actions ✅

###  Backend Features
- **Authentication**: JWT-based auth with Fayda OIDC integration
- **User Management**: Custom user model with role-based permissions
- **Advisory System**: Expert consultation, agricultural guides, training courses, downloadable resources
- **News System**: Articles with categories, tags, featured content
- **Weather System**: Ethiopian weather data, forecasts, farming recommendations
- **Logistics System**: Delivery tracking, service providers, cost estimation
- **Payment System**: Ethiopian payment providers M-pesa,Telebirr Currently integrated (Chapa)
- **Marketplace System**: Products, orders, e-commerce functionality
- **Orders**: Order tracking, payment integration, notifications
- **Fayda OIDC Integration**: Ethiopian eID authentication system
- **API Documentation**: Swagger/OpenAPI documentation available
- **Docker Configuration**: Full containerization setup 
- **CI/CD Pipeline**: Automated testing with GitHub Actions
- **Complete Backend System**: Full Django REST API with 8 major systems

###  Frontend Features
- **Modern UI**: React.js with Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Component Architecture**: Reusable UI components
- **Authentication Integration**: Ready for backend auth

---

##  Tech Stack

- **Backend:** Django 5.2.4, Django REST Framework 3.16.0
- **Database:** PostgreSQL with Redis for caching
- **Frontend:** React.js, Tailwind CSS, Vite
- **Authentication:** JWT + Fayda OIDC integration
- **API Documentation:** DRF YASG (Swagger/OpenAPI)
- **Containerization:** Docker + Docker Compose V2
- **CI/CD:** GitHub Actions with automated testing
- **Weather API:** Integration planned
- **Payments:** Chapa API(Already integrated) / Telebirr (planned)
- **Logistics Integration:** Custom API endpoints for logistics providers
- **Deployment:** Docker + Railway / Render / DigitalOcean *(depending on final hosting)*

---

##  Quick Start

### Backend Setup
```bash
cd Ersha_Ecosystem_Backend
docker compose up --build
```

### Frontend Setup
```bash
cd Ersha_Ecosystem_Frontend
pnpm install
pnpm run dev
```
### Frontend Setup for linux users
```bash
cd Ersha_Ecosystem_Frontend
sudo npm install -g pnpm
pnpm install
pnpm run dev
```

For detailed setup instructions, see the respective README files in each directory.

---

🏁 *Ersha-Ecosystem is built for impact to modernize African agriculture through data, direct access, and digital inclusion.*  
