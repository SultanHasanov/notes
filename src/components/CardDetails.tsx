import React, { useEffect, useState } from "react";
import { List, Checkbox, Space, Toast, Button } from "antd-mobile";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Popconfirm, Modal, Input, message  } from "antd";

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
  const [isModalVisible, setIsModalVisible] = useState(false); // состояние для показа модалки
  


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
        message.success("Заметка добавлена");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value); // Устанавливаем текст, извлекая значение из события
  };

  const editNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
    setIsModalVisible(true); // открываем модалку
  };

  const saveEditedNote = async () => {
    const updatedNotes = card.notes.map((note: Note) =>
      note.id === editingNoteId ? { ...note, text: editingText } : note
    );
    const updatedCard = { ...card, notes: updatedNotes };

    try {
      const response = await axios.patch(
        `https://b25a776acd1c337f.mokky.dev/items/${id}`,
        updatedCard
      );
      setCard(response.data); // обновляем карточку с новыми данными с сервера
      setIsModalVisible(false); // закрываем модалку
      setEditingNoteId(null); // сбрасываем редактируемую заметку
      setEditingText(""); // очищаем текст
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      Toast.show("Не удалось сохранить заметку!");
    }
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
          onChange={(e) => setNewNoteText(e.target.value)} // Изменено с 'val' на 'e' и извлечен текст
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
                <span>{note.text.length > 20
                    ? note.text.slice(0, 20) + "..."
                    : note.text}</span>
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

      {/* Модальное окно для редактирования */}
      <Modal
        title="Редактировать заметку"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)} // Закрытие модалки
        onOk={saveEditedNote} // Сохранение изменений
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Input
          value={editingText}
          onChange={handleChange} // Привязка к обработчику
          placeholder="Введите текст заметки"
        />
      </Modal>
    </div>
  );
};
