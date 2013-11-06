using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public class BlackJackDealer : Player, IDealBlackJack // used specific for the game of black jack, this person deals the cards for the casino
    {
        public event ChangeMoneyEvent ChangeMoney;
        public int Wager { get; set; }
        public CardsDeck Deck;
        public BlackJackDealer(CardsDeck deck) : base("dealer", 0, Gender.Male)
        {
            this.Deck = deck;
            this.Hand = new List<Card>(6);
            this.PlayerFrame = Draw.dealerCardsFrame;
        }

        public BlackJackDealer()
        { 

        }

        //public void AddCard(Card card)
        //{
        //    //TODO: implement method to add new drawn cards to hand of the dealer
        //    this.Hand.Add(card);
        //    Frame frame = Draw.dealerCardsFrame;
        //    Draw.DrawCard(card, frame.TopLeft, this.Hand.Count);
        //}
        public void GetBlackJack()
        {
            this.Score = int.MaxValue;
        }
       
        public void DealCardToPlayer(BlackJackPlayer player)
        {
            //TODO: implemet a method to deal a card from the dect to the player's hand
            player.AddCard(this.Deck.GetUpperCard());
        }
        public void DealCardHimself(bool toLimit, int playerScore)
        {
            // TODO: write a method to deal cards to meself until condition when player stands
            if (toLimit)
            {
                bool toContinue = true;
                while (toContinue)
                {
                    if (playerScore != int.MaxValue)
                    {
                        if (this.CountScore() >= 21)
                        {
                            toContinue = false;
                        }
                        else if (this.CountScore() > playerScore)
                        {
                            toContinue = false;
                        }
                        else if (this.Score == playerScore)
                        {
                            if (this.Score >= 12)
                            {
                                toContinue = false;
                            }
                        }
                        else
                        {
                            this.AddCard(this.Deck.GetUpperCard());
                        }
                    }
                    else
                    {
                        this.AddCard(this.Deck.GetUpperCard());
                        toContinue = false;
                    }

                }
            }
            else
            {
                this.AddCard(this.Deck.GetUpperCard());
            }
        }
        public string CheckScore(BlackJackPlayer player)
        {
            int dealerScore = this.CountScore();
            int playerScore = player.CountScore();
            bool isBJ = false;

            if (dealerScore == int.MaxValue || playerScore == int.MaxValue)
            {
                isBJ = true;
            }
            if (isBJ && dealerScore != 21) // Dealer bust.
            {
                this.HandleMoney(this.Wager * 2, player);
                return "Player win";
            }
  
            //if (dealerScore != int.MaxValue && dealerScore > 21) // Dealer bust.
            //{
            //    this.HandleMoney(this.Wager * 2, player);
            //    return "Player win";
            //}
            else if (dealerScore == playerScore) 
            {
                this.HandleMoney(this.Wager, player);
                return "Push";
            }
            else if (dealerScore > playerScore)
            {
                return "Dealer win";
            }
            else
            {
                this.HandleMoney(this.Wager * 2, player);
                return "Dealer win";
            }
        }
        public void HandleMoney(int money, BlackJackPlayer player)
        {
            ChangeMoney(money);
        }

        public void ShuffleCards()
        {
            //TODO: implement method to call the shuffleDeck method of the deck
            this.Deck = new CardsDeck();
            this.Deck.Suffle();
        }
    }
}
