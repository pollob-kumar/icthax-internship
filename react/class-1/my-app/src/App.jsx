import "./App.css";

function App() {
  const name = "Pollob";
  const skills = ["HTML", "CSS", "JavaScript", "React"];
  const year = new Date().getFullYear();

  return (
    <div className="app">
      <div className="card">
        <img src="https://picsum.photos/150" alt="Profile" className="avatar" />
        <h1>Hello, {name}!</h1>
        <p className="role">Web Developer</p>

        <h3>Amar Skills:</h3>
        <ul>
          {skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <button onClick={() => alert("Hello React!")}>Click Me</button>

        <p className="footer">&copy; {year}</p>
      </div>
    </div>
  );
}

export default App;
