<div align="right">

</div>

<div align="center">
  <h2>Shita Multi Vendor Delivery Management System</h2>
  <i>A modern and customizable platform for managing online ordering and logistics across industries.</i>
 <br/>
<br />
</div>

<div align="center">

[![Static Badge](https://img.shields.io/badge/License-MIT-red)](https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/ferasshita/Shita-Multivendor-Food-Delivery.svg)](https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/stargazers)
[![Forks](https://img.shields.io/github/forks/ferasshita/Shita-Multivendor-Food-Delivery.svg)](https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/ferasshita/Shita-Multivendor-Food-Delivery)](https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/graphs/contributors)
[![Open Pull Requests](https://img.shields.io/github/issues-pr-raw/ferasshita/Shita-Multivendor-Food-Delivery.svg)](https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/pulls)
[![Activity](https://img.shields.io/github/last-commit/ferasshita/Shita-Multivendor-Food-Delivery.svg)](https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/commits/main)
[![YouTube Channel](https://img.shields.io/badge/Watch_us-Youtube-red)](https://www.youtube.com/@ninjascode509)

</div>


<br>

The Shita Multi Vendor Delivery Management System is designed for businesses looking to deploy a complete, ready-to-use platform for running their online ordering and delivery operations. Whether it is food or grocery delivery, parcel logistics, home services, flowers, pharmacy orders, or other delivery-based businesses, Shita can be adapted to your needs.
Built with ease of use and intuitiveness in mind, the Shita system supports multiple vendors and multiple service regions. With separate applications for customers, vendors and delivery agents, along with a powerful admin dashboard, Shita enables you to launch and operate your own end-to-end ordering and delivery ecosystem without building everything from scratch.


<!-- Add a horizontal rule for separation -->
<hr/>

## :fast_forward: Quick Links


- [:book: What is included](#heading-1)
- [:rocket: Features](#heading-2)
- [:wrench: Setup](#heading-3)
- [:gear: Prerequisites](#heading-4)
- [:computer: Technologies](#heading-5)
- [:camera: Screenshots](#heading-6)
- [:triangular_ruler: High Level Architecture](#heading-7)
- [:busts_in_silhouette: Contributors](#heading-10)
- [:computer: Project Setup Guide](#heading-15)


<!-- Add a horizontal rule for separation -->
<hr/>

## :question: What is included: <a id="heading-1"></a>

Shita provides a complete set of software components, including:

- Shita Multi Vendor Customer App
- Shita Multi Vendor Rider/Driver App
- Shita Multi Vendor Vendor/Store App
- Customer Ordering Website
- Admin Web Dashboard
- API Server
- Analytics Dashboard using Expo Amplitude
- Error monitoring and reporting with Sentry

## :fire: Features: <a id="heading-2"></a>

- Authentication using Google, Apple, and Facebook
- Dynamic home sections for highlighting top vendors and services
- Push notifications and email alerts for account creation, order updates, and delivery progress
- Real-time tracking of delivery agents and in-app chat
- Email and phone number verification
- Location-based vendor discovery on Maps and Home Screen
- Multi-language support and customizable themes
- Ratings and reviews for orders and service experiences
- Vendor/service details including ratings, schedules, delivery timelines, offerings, location, minimum order or service amount, and more
- Payment integrations including PayPal and Stripe
- Order and booking history with the ability to favorite vendors
- Address management with Google Places suggestions and Maps integration
- Analytics and error reporting with Amplitude and Sentry
- Support for item/service variations, notes, pickup and delivery modes, and customizable timing options


## :repeat_one: Setup: <a id="heading-3"></a>

As we've mentioned above, the solution includes five separate modules. To setup these modules, follow the steps below:

To run the module, you need to have nodejs installed on your machine. Once nodejs is installed, go to the directory and enter the following commands

The required credentials and keys have been set already. You can setup your own keys and credentials

The version of nodejs should be between 18 to 20 (with 16 as minor version and 0 as patch)

## :information_source: Prerequisites: <a id="heading-4"></a>

App Ids for Mobile App in app.json

- Facebook Scheme
- Facebook App Id
- Facebook Display Name
- iOS Client Id Google
- Android Id Google
- Amplitude Api Key
- server url

Set credentials in API in file helpers/config.js and helpers/credentials.js

- Email User Name
- Password For Email
- Mongo User
- Mongo Password
- Mongo DB Name
- Reset Password Link
- Admin User name
- Admin Password
- User Id
- Name

Set credentials in Admin Dashboard in file src/index.js

- Firebase Api Key
- Auth Domain
- Database Url
- Project Id
- Storage Buck
- Messaging Sender Id
- App Id

NOTE: Email provider has been only been tested for gmail accounts

## :hammer_and_wrench: Technologies: <a id="heading-5"></a>

|                                               Expo                                                |                                                   React-Navigation                                                   |                                                Apollo GraphQL                                                |                                               ReactJS                                                |                                                NodeJS                                                 |                                                 MongoDB                                                 |                                                   Firebase                                                   |
| :-----------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| <a href="https://expo.dev/"><img src="./assets/expoicon.png" alt="Shita Logos" width="100"></a> | <a href="https://reactnavigation.org/"><img src="./assets/react-navigation.png" alt="Shita Logos" width="100"></a> | <a href="https://www.apollographql.com/"><img src="./assets/apollo.png" alt="Shita Logos" width="100"></a> | <a href="https://reactjs.org/"><img src="./assets/react-js.png" alt="Shita Logos" width="100"></a> | <a href="https://nodejs.org/en/"><img src="./assets/node-js.png" alt="Shita Logos" width="100"></a> | <a href="https://www.mongodb.com/"><img src="./assets/mongoDB.png" alt="Shita Logos" width="100"></a> | <a href="https://firebase.google.com/"><img src="./assets/firebase.png" alt="Shita Logos" width="100"></a> |

|                                                 React Native                                                 |                                                       React Router                                                       |                                                GraphQL                                                |                                                ExpressJS                                                 |                                                   React Strap                                                    |                                                Amplitude                                                |
| :----------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
| <a href="https://reactnative.dev/"><img src="./assets/react-native.png" alt="Shita Logos" width="100"></a> | <a href="https://reactrouter.com/"><img src="./assets/react-router-svgrepo-com.png" alt="Shita Logos" width="100"></a> | <a href="https://graphql.org/"><img src="./assets/graphQl-1.png" alt="Shita Logos" width="100"></a> | <a href="https://expressjs.com/"><img src="./assets/express-js.png" alt="Shita Logos" width="100"></a> | <a href="https://reactstrap.github.io/"><img src="./assets/React-strap.png" alt="Shita Logos" width="100"></a> | <a href="https://amplitude.com/"><img src="./assets/amplitude.png" alt="Shita Logos" width="100"></a> |

## :framed_picture: Screenshots: <a id="heading-6"></a>

|          Rider App           |
| :--------------------------: |
| ![](./assets/RiderApp.jfif) |

|               Store APP               |
| :----------------------------------------: |
| ![](./assets/StoreApp.jfif) |

|          Customer App           |
| :-----------------------------: |
| ![](./assets/CostumerApp.jfif) |

|             Dashboard              |
| :--------------------------------: |
| ![](./assets/AdminDashboard.jfif) |

## :wrench: High Level Architecture: <a id="heading-7"></a>

![](./assets/high-level.jfif)

## :people_holding_hands: Contributors: <a id="heading-10"></a>

<div align="center">
<br>
<a href="https://github.com/ferasshita/Shita-Multivendor-Food-Delivery/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ferasshita/Shita-Multivendor-Food-Delivery" style="max-width: 50%; height: auto;" />
</a>
</div>


## :computer: Project Setup Guide <a id="heading-15"></a>

This section provides detailed instructions for setting up and running each component of the Shita Multi-vendor Food Delivery Solution.

### Shita Admin Dashboard (Next.js)

The admin dashboard allows you to manage restaurants, orders, riders, and more.

```bash
# Navigate to the admin dashboard directory
cd shita-multivendor-admin

# Install dependencies
npm install

# Start the development server
npm run dev
```

After running these commands, open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the admin dashboard. You can also CTRL+click on the localhost link that appears in your terminal.

### Shita Customer Web (React.js)

The customer web application allows users to browse restaurants and place orders through a web browser.

```bash
# Navigate to the customer web directory
cd shita-multivendor-web

# Install dependencies
npm install

# Start the development server
npm start
```

After running these commands, the application will be available at [http://localhost:3000](http://localhost:3000) in your web browser.

### Shita Customer App (React Native)

The customer mobile application allows users to browse restaurants and place orders on their mobile devices.

```bash
# Navigate to the customer app directory
cd shita-multivendor-app

# Install dependencies
npm install

# Start the Expo development server
npx expo start -c
# OR
npm start -c
```

#### Testing on a Physical Device with Expo Go

1. Press `s` in the terminal to switch to Expo Go mode
2. Scan the QR code displayed in the terminal:
   - Android: Open the Expo Go app and scan the QR code
   - iOS: Use the device's camera app to scan the QR code

### Shita Rider App (React Native)

The rider app allows delivery personnel to manage and complete deliveries.

```bash
# Navigate to the rider app directory
cd shita-multivendor-rider

# Install dependencies
npm install

# Start the Expo development server
npx expo start -c
# OR
npm start -c
```

#### Testing on a Physical Device with Expo Go

1. Press `s` in the terminal to switch to Expo Go mode
2. Scan the QR code displayed in the terminal:
   - Android: Open the Expo Go app and scan the QR code
   - iOS: Use the device's camera app to scan the QR code

### Shita Restaurant App (React Native)

The restaurant app allows restaurant owners to manage orders and their menu.

```bash
# Navigate to the restaurant app directory
cd shita-multivendor-restaurant

# Install dependencies
npm install

# Start the Expo development server
npx expo start -c
# OR
npm start -c
```

#### Testing on a Physical Device with Expo Go

1. Press `s` in the terminal to switch to Expo Go mode
2. Scan the QR code displayed in the terminal:
   - Android: Open the Expo Go app and scan the QR code
   - iOS: Use the device's camera app to scan the QR code

### Building Development Versions

For all mobile apps (Customer, Rider, and Restaurant), you can create development builds using EAS Build.

#### Configure EAS Build

```bash
# From the app directory (customer, rider, or restaurant)
eas build:configure
```

Select your desired platform:
- android
- ios
- all

#### Build for Android

```bash
eas build --platform android --profile development
```

This will create an APK file that you can install directly on your Android device.

#### Build for iOS

```bash
eas build --platform ios --profile development
```

For iOS simulator builds, modify the `eas.json` file to include:

```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "channel": "development",
  "ios": {
    "simulator": true
  },
  "android": {
    "buildType": "apk"
  }
}
```

Then run:

```bash
eas build --platform ios --profile development
```
