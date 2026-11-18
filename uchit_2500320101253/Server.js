const express = require("express");
const app = express();

app.use(express.json());

let leaves = [
  { id: 701, employeeName: "Ananya Singh", employeeCode: "EMP101", leaveType: "Casual", days: 2, status: "Pending" },
  { id: 702, employeeName: "Rahul Verma", employeeCode: "EMP102", leaveType: "Sick", days: 1, status: "Approved" },
  { id: 703, employeeName: "Simran Kaur", employeeCode: "EMP103", leaveType: "Earned", days: 3, status: "Rejected" }
];

let nextId = 704;

function valid(d) {
  return d &&
    typeof d.employeeName === "string" && d.employeeName.trim() &&
    typeof d.employeeCode === "string" && d.employeeCode.trim() &&
    ["Casual", "Sick", "Earned"].includes(d.leaveType) &&
    Number.isInteger(d.days) && d.days > 0 &&
    ["Pending", "Approved", "Rejected"].includes(d.status);
}

app.get("/api/leaves", (req, res) => {
  res.status(200).json(leaves);
});

app.post("/api/leaves", (req, res) => {
  if (!valid(req.body))
    return res.status(400).json({ message: "Invalid data" });

  const record = { id: nextId++, ...req.body };
  leaves.push(record);
  res.status(201).json(record);
});

app.get("/api/leaves/filter", (req, res) => {
  const result = leaves.filter(r =>
    r.status.toLowerCase() === (req.query.status || "").toLowerCase()
  );
  res.json(result);
});

app.get("/api/leaves/pending", (req, res) => {
  res.json(leaves.filter(r => r.status === "Pending"));
});

app.get("/api/leaves/:id", (req, res) => {
  const record = leaves.find(r => r.id === Number(req.params.id));
  if (!record) return res.status(404).json({ message: "Not found" });
  res.json(record);
});

app.put("/api/leaves/:id", (req, res) => {
  const record = leaves.find(r => r.id === Number(req.params.id));
  if (!record) return res.status(404).json({ message: "Not found" });
  if (!valid(req.body)) return res.status(400).json({ message: "Invalid data" });

  Object.assign(record, req.body);
  res.json(record);
});

app.delete("/api/leaves/:id", (req, res) => {
  const index = leaves.findIndex(r => r.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });

  leaves.splice(index, 1);
  res.json({ message: "Leave deleted successfully" });
});

app.listen(3000, () => console.log("Server running on port 3000"));