const io = require('socket.io-client')
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);


  socket.emit("start_edit", { contactId: "123", username: "user1" });


  socket.on("lock_update", (locks) => {
    console.log("Current locks:", locks);
  });

  socket.on("lock_denied", (data) => {
    console.log("Lock denied:", data);
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
