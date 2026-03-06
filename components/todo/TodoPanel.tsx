"use client";

import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { User } from "@supabase/supabase-js";

type LocalTodo = { id: string; title: string; done: boolean };

type TodoPanelProps = {
  user: User | null;
};

export function TodoPanel({ user }: TodoPanelProps) {
  const [localTodos, setLocalTodos] = React.useState<LocalTodo[]>([]);
  const [input, setInput] = React.useState("");

  const handleAdd = () => {
    const t = input.trim();
    if (!t) return;
    setLocalTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: t, done: false },
    ]);
    setInput("");
  };

  const handleToggle = (id: string) => {
    setLocalTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setLocalTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        To-do
      </Typography>
      {!user && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          Sign in to save and sync to-dos. These are temporary.
        </Typography>
      )}
      <TextField
        size="small"
        placeholder="Add to-do"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleAdd} aria-label="add">
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <List dense disablePadding>
        {localTodos.map((todo) => (
          <ListItem
            key={todo.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                onClick={() => handleDelete(todo.id)}
                aria-label="delete"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            }
          >
            <Checkbox
              size="small"
              checked={todo.done}
              onChange={() => handleToggle(todo.id)}
              sx={{ pr: 1 }}
            />
            <ListItemText
              primary={todo.title}
              primaryTypographyProps={{
                variant: "body2",
                sx: todo.done ? { textDecoration: "line-through", color: "text.secondary" } : {},
              }}
            />
          </ListItem>
        ))}
      </List>
      {localTodos.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No to-dos yet. Add one above.
        </Typography>
      )}
    </Box>
  );
}
