// src/components/CompletedCards.tsx
import React, { useEffect, useState } from 'react';
import { Card } from 'antd-mobile';
import axios from 'axios';

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

export const CompletedCards: React.FC = () => {
  const [completedCards, setCompletedCards] = useState<CardItem[]>([]);

  const fetchCompletedCards = async () => {
    const response = await axios.get('https://b25a776acd1c337f.mokky.dev/items');
    const completed = response.data.filter((card: CardItem) =>
      card.notes.every((note: Note) => note.completed)
    );
    setCompletedCards(completed);
  };

  useEffect(() => {
    fetchCompletedCards();
  }, []);

  return (
    <div>
      {completedCards.map(card => (
        <Card key={card.id}>
          <h3>{card.title}</h3>
        </Card>
      ))}
    </div>
  );
};
