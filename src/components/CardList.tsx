// src/components/CardList.tsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Input, Row, Col, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../App.css";

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

export const CardList: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const navigate = useNavigate();

  const fetchCards = async () => {
    const response = await axios.get('https://b25a776acd1c337f.mokky.dev/items');
    setCards(response.data);
  };

  const createCard = async () => {
    if (!newCardTitle.trim()) return;
    const newCard = { title: newCardTitle, notes: [] };
    const response = await axios.post('https://b25a776acd1c337f.mokky.dev/items', newCard);
    setCards([...cards, response.data]);
    setNewCardTitle('');
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const calculateProgress = (notes: Note[]) => {
    if (!notes.length) return 0;
    const completedNotes = notes.filter(note => note.completed).length;
    return Math.round((completedNotes / notes.length) * 100);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Добавить карточку
      </Button>

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
          onChange={e => setNewCardTitle(e.target.value)}
        />
      </Modal>

      {/* Сетка карточек */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {cards.map(card => (
          <Col xs={8} sm={2} md={8} key={card.id}>
            <Card
            className='card'
              title={card.title}
              hoverable
              onClick={() => navigate(`/card/${card.id}`)}
              style={{ textAlign: 'center' }}
            >
              <Progress
                type="circle"
                percent={calculateProgress(card.notes)}
                size={40}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
