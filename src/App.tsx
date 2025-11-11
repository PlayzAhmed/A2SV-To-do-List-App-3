import { NavLink, Outlet, useLocation } from "react-router";
import "./styles/app.css";
import { useRef, useState } from "react";

export type TaskType = {
  name: string;
  description: string;
  status: "notStarted" | "inProgress" | "finished";
}

const App = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState<TaskType[]>([
    {
      name: "A2SV Web Task",
      description:
        "Building a To-do List App for the A2SV Web Track Task 4 using React, TypeScript and CSS.",
      status: "inProgress",
    },
    {
      name: "A2SV Problem Solving",
      description: "Solving a problem on A2SV Hub to not lose the streak!",
      status: "finished",
    },
    {
      name: "Physics Session",
      description: "Watching the lectures and solving H.W.",
      status: "notStarted",
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  function onClick() {
    if (inputRef.current && inputRef.current.value.trim() != "") {
      console.log(inputRef.current.value.trim());
      const newTask: TaskType[] = [{
        name: inputRef.current.value.trim(),
        description: "Add a description to the task....",
        status: "notStarted",
      }]
      setTasks([...tasks, ...newTask]);
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <main>
        <section className="sidebar">
          <h1>To-do List App</h1>
          <hr/>
          <div className="add-task-container">
            <input type="text" placeholder="Type the task name...." ref={inputRef} />
            <button type="submit" onClick={onClick}>Add</button>
          </div>
          <hr/>
          <div className="tasks-list">
            <ul>
              {!tasks.length && <li>No tasks found.</li>}
              {tasks.map((task: TaskType, index: number) => (
                <li key={index} className={"task-item"}>
                  <NavLink to={`/task/${index}`} className={({ isActive }) => (
                    isActive ? "active" : ""
                  ) }>{task.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="task">
          <Outlet key={location.pathname} context={{ tasks, setTasks }}/>
        </section>
      </main>
    </>
  );
};

export default App;

