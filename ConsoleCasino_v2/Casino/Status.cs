using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public class Status  // this class displayes current status of the player assets
    {
        private BlackJackPlayer player;  // used for the game black jack

        public Status(BlackJackPlayer player)  // constructor takes a object of class BlackJackPlayer
        {
            this.player = player;
        }

        public void DispalyStatus()
        {
            string[] statusItems = new string[2];  // creates array of strings with the status info
            statusItems[0] = string.Format("Money:{0}$", this.player.Money); // info abaut the current money balance
            //Draw.ClearFrame(Draw.statusDisplay);  // clear the status
            Draw.DrawTextInFrame(statusItems, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black)); // display the actual text from the string array
        }
    }
}
