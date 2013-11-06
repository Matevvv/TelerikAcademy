using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public abstract class Player : IBlackJack // used to create different game players to play different games in the casino
    {
        public string Name { get; protected set; }
        public int Money { get; set; }
        public Gender Sex { get; protected set; }
        public int Score { get; protected set; }
        public Frame PlayerFrame {get; protected set;}
        public List<Card> Hand;
        public Player()
        { 
        }
        public void AddCard(Card card)
        {
            this.Hand.Add(card);
            Draw.DrawCard(card, this.PlayerFrame.TopLeft, this.Hand.Count);
        }
        public Player(string name, int money, Gender sex)
        {
            this.Name = name;
            this.Money = money;
            this.Sex = sex;
        }

        public void ClearHand()
        {
            this.Hand.Clear();
        }
        public int CountScore()
        {
            int score = 0;
            int aces = 0;
            for (int i = 0; i < this.Hand.Count(); i++)
            {
                if (this.Hand[i].CardRank == CardRank.Ace)
                {
                    aces++;
                }
                score += this.Hand[i].CardRank.Value;
            }
            while (aces > 0 && score > 21)
            {
                score -= 10;
                aces--;
            }
            // If blackjack
            if (score == 21 && this.Hand.Count() == 2)
            {
                score = int.MaxValue;
            }
            this.Score = score;
            return score;
        }
    }
}
