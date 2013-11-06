using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    interface IPlayBlackJack  // these are the basic functions of a player who can play the game Black Jack
    {

        bool CanBet(int bet);

        void UpdateMoney(int money);
    }
}
