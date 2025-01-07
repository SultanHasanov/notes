// src/components/CardDetails.tsx
import React, { useEffect, useState } from "react";
import { Input, List, Checkbox, Space, Toast, Button } from "antd-mobile";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";

interface Note {
  id: string;
  text: string;
  completed: boolean;
}

export const CardDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleDeleteCard = async (id: number) => {
    await axios.delete(`https://b25a776acd1c337f.mokky.dev/items/${id}`);
    navigate("/");
  };

  const fetchCard = async () => {
    const response = await axios.get(
      `https://b25a776acd1c337f.mokky.dev/items/${id}`
    );
    setCard(response.data);
  };

  const addNote = async () => {
    if (!newNoteText.trim()) {
      Toast.show("Введите текст заметки!");
      return;
    }
    const newNote = {
      id: Date.now().toString(),
      text: newNoteText,
      completed: false,
    };
    const updatedCard = { ...card, notes: [...card.notes, newNote] };
    await axios.patch(
      `https://b25a776acd1c337f.mokky.dev/items/${id}`,
      updatedCard
    );
    setCard(updatedCard);
    setNewNoteText("");
  };

  const toggleNoteCompletion = async (noteId: string) => {
    const updatedNotes = card.notes.map((note: Note) =>
      note.id === noteId ? { ...note, completed: !note.completed } : note
    );
    const updatedCard = { ...card, notes: updatedNotes };
    await axios.patch(
      `https://b25a776acd1c337f.mokky.dev/items/${id}`,
      updatedCard
    );
    setCard(updatedCard);
  };

  const deleteNote = async (noteId: string) => {
    const updatedNotes = card.notes.filter((note: Note) => note.id !== noteId);
    const updatedCard = { ...card, notes: updatedNotes };
    await axios.patch(
      `https://b25a776acd1c337f.mokky.dev/items/${id}`,
      updatedCard
    );
    setCard(updatedCard);
  };

  const editNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  const saveEditedNote = async () => {
    const updatedNotes = card.notes.map((note: Note) =>
      note.id === editingNoteId ? { ...note, text: editingText } : note
    );
    const updatedCard = { ...card, notes: updatedNotes };
    await axios.patch(
      `https://b25a776acd1c337f.mokky.dev/items/${id}`,
      updatedCard
    );
    setCard(updatedCard);
    setEditingNoteId(null);
    setEditingText("");
  };

  useEffect(() => {
    fetchCard();
  }, [id]);

  return (
    <div style={{ padding: "16px" }}>
      <div className="header-card">
        <Button fill="none" onClick={() => navigate(-1)}>
          {" "}
          <ArrowLeftOutlined /> Назад
        </Button>
        <Popconfirm
          placement="topLeft"
          title="Удалить?"
          onConfirm={() => handleDeleteCard(Number(id))}
          okText="Да"
          cancelText="Нет"
        >
          <DeleteOutlined
            style={{ fontSize: "24px", color: "red", marginRight: 10 }}
          />
        </Popconfirm>
      </div>
      <h1>{card?.title}</h1>
      <Space block>
        <Input
          placeholder="Введите текст заметки"
          value={newNoteText}
          onChange={(val) => setNewNoteText(val)}
          style={{ flexGrow: 1 }}
        />
        <PlusCircleOutlined
          onClick={addNote}
          style={{ fontSize: "28px", color: "#1677ff" }}
        />
      </Space>

      <List style={{ marginTop: "16px" }}>
        {card?.notes.map((note: Note) => (
          <List.Item key={note.id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* Левая часть: Чекбокс и текст */}
              <Space align="center">
                <Checkbox
                  checked={note.completed}
                  onChange={() => toggleNoteCompletion(note.id)}
                  style={{ marginRight: "8px" }}
                />
                {editingNoteId === note.id ? (
                  <Input
                    value={editingText}
                    onChange={(val) => setEditingText(val)}
                    style={{ flexGrow: 1 }}
                  />
                ) : (
                  <span>{note.text}</span>
                )}
              </Space>

              {/* Правая часть: Иконки */}
              <Space>
                <EditOutlined
                  onClick={() => editNote(note)}
                  style={{
                    fontSize: "25px",
                    color: "#1677ff",
                    marginRight: "10px",
                  }}
                />
                <Popconfirm
                  placement="topLeft"
                  title="Удалить?"
                  onConfirm={() => deleteNote(note.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <DeleteOutlined style={{ fontSize: "24px", color: "red" }} />
                </Popconfirm>
              </Space>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
};
