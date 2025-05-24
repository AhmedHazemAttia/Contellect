## Contacts Management App
A full-stack contacts management application built with Angular and Node.js. It supports real-time collaborative editing via WebSockets, role-based permissions (admin/user), pagination, and search.

Features
* User authentication with JWT

* Role-based access control (Admin and User roles)

* Real-time contact locking and unlocking via WebSocket

* Add, edit, delete contacts (Admin only for delete and Edit)

* Search and pagination

* Responsive and user-friendly UI

* Clean and modular code architecture for easy maintenance

* Ready for containerization (Docker)

## Tech Stack
* Frontend: Angular (with FormsModule, RouterModule, CommonModule)

* Backend: Node.js with Express and MongoDB

* WebSockets: Socket.IO 

* Authentication: JWT

## Prerequisites
* Node.js >= 18.x
* npm 
* Angular CLI (optional for frontend development)
* MongoDB V-8.5 

* WebSocket server running alongside backend

### Backend
Navigate to the backend directory:

```cd Backend ```
Install dependencies:

```npm install```
Configure environment variables in .env (e.g., DB connection string, JWT secret):

```DB_URI=your_db_uri_here || JWT_SECRET=your_jwt_secret```
Start the backend server:

```npm run dev | npm run start = for building into dist file```

### Frontend
Navigate to the frontend directory:

```cd manage-contacts```
* Install dependencies:

```npm install```
Run the Angular development server:

```ng serve```
```Open your browser and navigate to http://localhost:4200```

## Usage
Login with your user credentials
``` user1 user1 ==> Admin// user2 user2.```

Use the search bar to filter contacts.

Admin users can add, edit, or delete contacts.

Users can edit contacts if not locked by others.

Contacts currently edited by other users show a locked message.

Pagination controls allow browsing through multiple pages.

WebSocket Collaboration
The app uses WebSockets to coordinate real-time locking of contacts during editing to prevent conflicts:

When a user starts editing a contact, the app sends a "lock" event via WebSocket.

Other users see that the contact is locked and cannot edit it.

When editing is finished or canceled, the "unlock" event is sent.

Validation and Error Handling
Form inputs are validated on the frontend before sending updates.

Validation errors are displayed inline above the corresponding input fields.

Backend validation ensures data consistency and security.

Errors during API calls show user-friendly messages.

Role-based Access Control
Admin users can add, edit, and delete contacts.

Regular users can view and edit contacts only if not locked.

Delete buttons are visible and enabled only for admins.

## Deployment and Containerization
Project is structured for easy Dockerization.

Contributing
Contributions are welcome! Please fork the repository and submit pull requests for improvements or bug fixes.


Contact
For questions or support, contact me via LinkedIn
``` www.linkedin.com/in/ahmed-hazem-08417916b ```
