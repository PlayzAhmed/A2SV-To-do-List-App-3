import { useParams, useOutletContext, useNavigate } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import type { TaskType } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/task.css";

interface Option {
  value: string;
  label: string;
}

const Task = () => {
  let params = useParams();
  if (isNaN(Number(params.taskId)))
    throw new Response("Page not found", { status: 404 });
  const taskId = Number(params.taskId);
  const { tasks, setTasks } = useOutletContext<{
    tasks: TaskType[];
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  }>();

  if (taskId < 0 || taskId >= tasks.length) {
    throw new Response("Page not found", { status: 404 });
  }

  const options: Option[] = [
    { value: "finished", label: "Finished" },
    { value: "inProgress", label: "In Progress" },
    { value: "notStarted", label: "Not Started" },
  ];

  const colorMap: Record<string, string> = {
    notStarted: "red",
    inProgress: "#f59e0b",
    finished: "#22c55e",
  };

  const [editName, setEditName] = useState(false);
  const taskNameTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [editDescription, setEditDescription] = useState(false);
  const taskDescriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const updated = [...tasks];
    if (
      e.target.value == "finished" ||
      e.target.value == "inProgress" ||
      e.target.value == "notStarted"
    ) {
      updated[taskId].status = e.target.value;
    }
    setTasks(updated);
  }

  function handleEditTaskName() {
    if (
      taskNameTextAreaRef.current &&
      taskNameTextAreaRef.current.value.trim() != ""
    ) {
      let updated = [...tasks];
      updated[taskId].name = taskNameTextAreaRef.current.value.trim();
      setTasks(updated);
      setEditName(false);
    }
  }

  function handleEditTaskDescription() {
    if (taskDescriptionTextAreaRef.current && taskDescriptionTextAreaRef.current.value.trim() != "") {
      let updated = [...tasks];
      updated[taskId].description = taskDescriptionTextAreaRef.current.value.trim();
      setTasks(updated);
      setEditDescription(false);
    }
  }

  function handleDeleteTask() {
    navigate('/');
    setTasks(tasks.filter((t, index) => index != taskId));
  }

  useEffect(() => {
    if (taskNameTextAreaRef.current) {
      taskNameTextAreaRef.current.focus();
    }
  }, [editName]);

  useEffect(() => {
    if (taskDescriptionTextAreaRef.current) {
      taskDescriptionTextAreaRef.current.focus();
    }
  }, [editDescription]);

  return (
    <>
      <div className="title">
        {editName ? (
          <>
            <textarea ref={taskNameTextAreaRef}>{tasks[taskId].name}</textarea>
            <button onClick={handleEditTaskName}>
              <FontAwesomeIcon icon={faFloppyDisk} title="save" />
            </button>
            <button onClick={() => setEditName(false)}>
              <FontAwesomeIcon icon={faXmark} title="cancel" />
            </button>
          </>
        ) : (
          <>
            <h2>{tasks[taskId].name}</h2>
            <button onClick={() => setEditName(true)}>
              <FontAwesomeIcon icon={faPenToSquare} title="edit" />
            </button>
          </>
        )}
      </div>
      <div className="description">
        {editDescription ? (
          <>
            <textarea ref={taskDescriptionTextAreaRef}>{tasks[taskId].description}</textarea>
            <button onClick={handleEditTaskDescription}>
              <FontAwesomeIcon icon={faFloppyDisk} title="save" />
            </button>
            <button onClick={() => setEditDescription(false)}>
              <FontAwesomeIcon icon={faXmark} title="cancel" />
            </button>
          </>
        ) : (
          <>
            <p>{tasks[taskId].description}</p>
            <button onClick={() => setEditDescription(true)}>
              <FontAwesomeIcon icon={faPenToSquare} title="edit" />
            </button>
          </>
        )}
      </div>
      <div className="footer-container">
        <select
          name="options"
          id="options"
          onChange={handleSelectChange}
          value={tasks[taskId].status}
          style={{ backgroundColor: colorMap[tasks[taskId].status] }}
        >
          {options.map((o) => (
            <option
              key={o.value}
              value={o.value}
              style={{
                backgroundColor: colorMap[o.value],
                padding: "200px",
              }}
            >
              {o.label}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteTask}>
          Delete
        </button>
      </div>
    </>
  );
};

export default Task;
