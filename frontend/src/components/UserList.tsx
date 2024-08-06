import React from 'react';

interface UserListProps {
  users: string[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="w-64 bg-primary p-4">
      <h2 className="text-xl font-heading font-semibold mb-4 text-text-dark">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user} className="mb-2 text-text-dark">
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;