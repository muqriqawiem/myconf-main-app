# MYCONF: Conference Management System

## Overview
**MYCONF** is a modern, web-based conference management system designed to streamline the organization of academic and professional conferences. It addresses key limitations in existing systems, such as inefficient data processing, manual report generation, and lack of user-friendly interfaces. Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), MYCONF automates submissions, reviews, scheduling, and analytics, offering a seamless experience for organizers, authors, and reviewers.

---

## Key Features
- **Automated Data Processing**: Efficient handling of paper submissions, reviews, and scheduling.
- **Comprehensive Analytics**: Real-time insights into conference metrics (submissions, payments, etc.).
- **Role-Based Access Control**: Tailored dashboards for **Administrators, Authors, Reviewers, and Conference Chairs**.
- **Secure Payments**: Integrated Stripe gateway for conference fees and deposits.
- **Modern UI/UX**: Responsive design with intuitive navigation.
- **Collaboration Tools**: Email notifications, feedback systems, and document sharing.

---

## Technologies Used
| Category       | Technologies/Tools                                                                 |
|---------------|-----------------------------------------------------------------------------------|
| **Frontend**  | Next.js, React.js, Tailwind CSS                                                   |
| **Backend**   | Node.js, Express.js                                                               |
| **Database**  | MongoDB Atlas                                                                     |
| **APIs**      | RESTful APIs, JWT Authentication                                                  |
| **Payment**   | Stripe                                                                           |
| **Deployment**| Vercel (Frontend & Backend), MongoDB Atlas (Database)                            |
| **Analytics** | Metabase (Embedded dashboards)                                                   |

---

## Screenshots & Demo

| Feature          | Screenshot       |
|------------------|------------------|
| User Dashboard   | ![Dashboard]     |
| Paper Submission | ![Submission]    |
| Admin Panel      | ![Admin]         |

*Live Demo:* [MYCONF on Vercel](https://myconf.vercel.app)

## Documentation

- **System Architecture**
- **ER Diagram** 
- **API Endpoints**  

## Testing

- **Unit Testing**: Manual validation of modules (User Management, Payments, etc.)  
- **Integration Testing**: Verified API interactions using Postman  
- **Error Handling**: Robust validation for forms, authentication, and payments  

## Acknowledgements

- **Teammate**: Rafiz Kamarull Azman (Collaborator on Conference Management Module)  
- **Third-Party Tools**: Stripe, SendGrid, Cloudinary, Metabase  

## Future Work

- **AI-Powered Paper Matching**: Automate reviewer assignments  
- **Mobile App**: Extend accessibility via iOS/Android  
- **Multi-Language Support**: Cater to international conferences  
