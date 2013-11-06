using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public class CardsDeck // holds the decks to play Black jack
    {
        public List<Card> Deck { get; set; } // holds list of all cards in the deck

        public Card this[int index]
        {
            get { return this.Deck.ElementAt<Card>(index); }
            private set { this.Deck[index] = value; }
        }

        public CardsDeck() // default constructor for a deck
        {
            this.Deck = new List<Card>(52); // new deck with 52 cards in it
            int countSuit = 0; // counter for suits
            int countRank = 0; /// counter for rank
            while (countSuit < (int)CardSuit.Suits.Length) // loop until suits over
            {
                while (countRank < (int)CardRank.Ranks.Length) // loop until ranks over
                {
                    this.Deck.Add(new Card(CardRank.Ranks[countRank], CardSuit.Suits[countSuit])); // create and add a card object to the current deck
                    countRank++;
                }
                countSuit++;
                countRank = 0;
            }
        }

        public Card GetUpperCard() // returns the most upper card in the current deck
        {
            //TODO: implement a card turning method, and be the 1st card on top the deck
            Card card = this.Deck.ElementAt<Card>(this.Deck.Count - 1);
            this.Deck.Remove(card);
            Card currentCard = card;
            return currentCard;
        }

        public void Suffle() // efectivly shuffles the deck. like a master.
        {
            // think this will randomize the cards
            Card currentCard;
            bool isEnd;
            bool toStop;
            Random random = new Random();
            int number = 0;
            while (true)
            {
                bool toContinue = number < 100;
                if (!toContinue)
                {
                    break;
                }
                int nextCard = random.Next(52);
                int prevCard = random.Next(52);
                toContinue = nextCard == prevCard;
                if (!toContinue)
                {
                    currentCard = this.Deck[nextCard];
                    this.Deck[nextCard] = this.Deck[prevCard];
                    this.Deck[prevCard] = currentCard;
                }
                if (nextCard != prevCard)
                {
                    isEnd = true;
                }
                else
                {
                    isEnd = nextCard >= 51;
                }
                toContinue = isEnd;
                if (!toContinue)
                {
                    nextCard++;
                    currentCard = this.Deck[nextCard];
                    this.Deck[nextCard] = this.Deck[prevCard];
                    this.Deck[prevCard] = currentCard;
                }
                if (nextCard != prevCard)
                {
                    toStop = true;
                }
                else
                {
                    toStop = nextCard != 51;
                }
                toContinue = toStop;
                if (!toContinue)
                {
                    nextCard--;
                    currentCard = this.Deck[nextCard];
                    this.Deck[nextCard] = this.Deck[prevCard];
                    this.Deck[prevCard] = currentCard;
                }
                number++;
            }
        }
    }
}
