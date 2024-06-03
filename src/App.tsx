import React, { useState, useCallback, useMemo } from "react";

interface User {
  name: string;
  public_repos: number;
}

interface Repo {
  full_name: string;
  stargazers_count: number;
}

const UserComponent: React.FC<{ user: User }> = ({ user }) => (
  <article>
    <h2>User Info</h2>
    <p>Full Name: {user.name}</p>
    <p>Number of Repositories: {user.public_repos}</p>
  </article>
);

const RepoComponent: React.FC<{ repo: Repo }> = ({ repo }) => (
  <article>
    <h2>Repo Info</h2>
    <p>Repository Name: {repo.full_name}</p>
    <p>Number of Stars: {repo.stargazers_count}</p>
  </article>
);

const App: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const [type, setType] = useState<"user" | "repo">("user");
  const [data, setData] = useState<User | Repo | null>(null);
  const [error, setError] = useState<string>("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNickname(e.target.value);
    },
    []
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setType(e.target.value as "user" | "repo");
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setData(null);

      const url =
        type === "user"
          ? `https://api.github.com/users/${nickname}`
          : `https://api.github.com/repos/${nickname}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to fetch data");
      }
    },
    [nickname, type]
  );

  const renderedData = useMemo(() => {
    if (type === "user" && data) {
      return <UserComponent user={data as User} />;
    }
    if (type === "repo" && data) {
      return <RepoComponent repo={data as Repo} />;
    }
    return null;
  }, [data, type]);

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={handleInputChange}
          placeholder="Enter nickname"
          required
        />
        <select value={type} onChange={handleSelectChange}>
          <option value="user">User</option>
          <option value="repo">Repo</option>
        </select>
        <button type="submit">Fetch</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {renderedData}
    </main>
  );
};

export default App;
