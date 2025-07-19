import React, { useEffect, useState } from "react";
import { fetchUsersBySeller } from "../api/fetchUsersBySeller"; // adjust path as needed

const UsersBySeller = ({ sellerId, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsersBySeller(sellerId, token);
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      loadUsers();
    }
  }, [sellerId, token]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Users Who Ordered From Seller</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersBySeller;
