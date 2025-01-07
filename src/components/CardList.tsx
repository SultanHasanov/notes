// src/components/CardList.tsx
import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Input, Row, Col, Progress, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface CardItem {
  id: string;
  title: string;
  notes: Note[];
}

interface Note {
  id: string;
  text: string;
  completed: boolean;
}

const getProgressColor = (percent: number) => {
  if (percent === 100) {
    return "#87d068"; // зеленый цвет для 100%
  } else {
    return {
      "0%": "#108ee9", // синий для 0%
      "100%": "#87d068", // зеленый для 100%
    };
  }
};

export const CardList: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedShowAllNotes = localStorage.getItem("showAllNotes");
    if (storedShowAllNotes !== null) {
      setShowAllNotes(JSON.parse(storedShowAllNotes));
    }
  }, []);

  const handleClickShowAllNotes = () => {
    if (showAllNotes) {
      // Удаляем запись из localStorage
      localStorage.removeItem("showAllNotes");
    } else {
      // Сохраняем новое состояние в localStorage
      localStorage.setItem("showAllNotes", JSON.stringify(!showAllNotes));
    }
    setShowAllNotes(!showAllNotes);
  };


  const fetchCards = async () => {
    const response = await axios.get(
      "https://b25a776acd1c337f.mokky.dev/items"
    );
    setCards(response.data);
  };

  const createCard = async () => {
    if (!newCardTitle.trim()) return;
    const newCard = { title: newCardTitle, notes: [] };
    const response = await axios.post(
      "https://b25a776acd1c337f.mokky.dev/items",
      newCard
    );
    setCards([...cards, response.data]);
    setNewCardTitle("");
    setIsModalVisible(false);
    message.success("Карточка добавлена");
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const calculateProgress = (notes: Note[]) => {
    if (!notes.length) return 0;
    const completedNotes = notes.filter((note) => note.completed).length;
    return Math.round((completedNotes / notes.length) * 100);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Добавить карточку
        </Button>
        <Button type="default" onClick={handleClickShowAllNotes}>
          {showAllNotes ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </Button>
      </div>

      {/* Модальное окно для ввода названия карточки */}
      <Modal
        title="Добавить карточку"
        visible={isModalVisible}
        onOk={createCard}
        onCancel={() => setIsModalVisible(false)}
        okText="Создать"
        cancelText="Отмена"
      >
        <Input
          placeholder="Введите название карточки"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
      </Modal>

      {/* Сетка карточек */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        {cards.map((card) => (
          <Col xs={8} sm={2} md={8} key={card.id}>
            <Card
              className="card"
              title={card.title}
              hoverable
              onClick={() => navigate(`/card/${card.id}`)}
              style={{
                textAlign: "center",
                position: "relative",
              }}
            >
              <Progress
                strokeColor={getProgressColor(calculateProgress(card.notes))}
                type="circle"
                percent={calculateProgress(card.notes)}
                size={40}
              />
              <div
                style={{
                  marginTop: "15px",
                  width: "100%",
                  opacity: 0.2,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "7px",
                }}
              >
                {showAllNotes // Показывать все заметки или только выполненные
                  ? card.notes.length > 0 &&
                    card.notes.slice(0, 4).map((note, index) => (
                      <div key={index} style={{ margin: "5px 0" }}>
                        {note.text.length > 20
                          ? note.text.slice(0, 20) + "..."
                          : note.text}
                      </div>
                    ))
                  : // Показывать все заметки или только выполненные
                    card.notes.length > 4 && (
                      <div style={{ margin: "5px 0", fontStyle: "italic" }}>
                        ...
                      </div>
                    )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
