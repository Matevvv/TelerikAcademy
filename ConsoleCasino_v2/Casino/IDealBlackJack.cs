using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    interface IDealBlackJack // used to describe the actions used by a proffesional black jack dealer in the casino
    {
        void DealCardToPlayer(BlackJackPlayer player);

        void DealCardHimself(bool toLimit, int playerScore);

        void ClearHand();

        void ShuffleCards();
        void HandleMoney(int money, BlackJackPlayer player);
    }
}
