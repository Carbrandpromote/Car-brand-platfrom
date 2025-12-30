import { useState } from "react";

const USERS = {
  admin: { password: "admin123", role: "admin", balance: 0, referralCode: "ADMIN001" },
  user: { password: "user123", role: "user", balance: 5, referralCode: "USER001", referredBy: "ADMIN001" }
};

const DEFAULT_ASSIGNMENTS = [
  { id: 1, brand: "Toyota", task: "Post about Toyota fuel efficiency on X", reward: 3, status: "open" },
  { id: 2, brand: "Ford", task: "Share Ford safety campaign link", reward: 4, status: "open" }
];

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState(DEFAULT_ASSIGNMENTS);

  const login = () => {
    if (USERS[username] && USERS[username].password === password) {
      setCurrentUser({ username, ...USERS[username] });
      setPage("dashboard");
    } else {
      alert("Invalid login");
    }
  };

  const addAssignment = () => {
    const brand = prompt("Car brand?");
    const task = prompt("Task description?");
    const reward = parseInt(prompt("Reward (number)?"), 10);
    if (brand && task && reward) {
      setAssignments([...assignments, { id: Date.now(), brand, task, reward, status: "open" }]);
    }
  };

  const completeTask = (id, reward) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, status: "submitted" } : a));
    setCurrentUser({ ...currentUser, balance: currentUser.balance + reward });
  };

  if (page === "login") {
    return (
      <div className="p-10 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Car Brand Promotion Platform</h1>
        <input placeholder="Username" className="border p-2 w-full mb-2" onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" className="border p-2 w-full mb-4" onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded" onClick={login}>Login</button>
        <p className="mt-4 text-sm">Demo logins:<br/>Admin: admin / admin123<br/>User: user / user123</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-2">Dashboard ({currentUser.role})</h2>
      <p className="mb-2">Balance: ${currentUser.balance}</p>
      <p className="mb-4">Referral Link: https://yourdomain.com/register?ref={currentUser.referralCode}</p>

      {currentUser.role === "admin" && (
        <button className="mb-4 bg-green-600 text-white px-3 py-1 rounded" onClick={addAssignment}>+ New Assignment</button>
      )}

      <div className="grid gap-4">
        {assignments.map(a => (
          <div key={a.id} className="border p-4 rounded">
            <h3 className="font-semibold">{a.brand}</h3>
            <p>{a.task}</p>
            <p className="text-sm">Reward: ${a.reward}</p>
            <p className="text-sm">Status: {a.status}</p>
            {currentUser.role === "user" && a.status === "open" && (
              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => completeTask(a.id, a.reward)}>Submit Task</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
