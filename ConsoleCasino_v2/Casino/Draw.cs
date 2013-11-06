using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public static class Draw  // class is used to describe how to draw elements on the console
    {
        // set size for main game frame
        public readonly static int mainFrameHeight; // height of the whole game screen
        public readonly static int mainFrameWidth; // width of the whole game screen
        // set size for the table on wich is playde the game
        public readonly static int tableHeight; // the height of the playing table
        public readonly static int tableWidth; // the width of the playing table

        public readonly static Frame mainFrameBorder; // the main frame border
        public readonly static Frame plyerCardsFrame; // where to draw players cards
        public readonly static Frame dealerCardsFrame; // where to draw dealerss cards
        public readonly static Frame menuFrame; // where to drow a menu
        public readonly static Frame gameMenu; // where to drow menu in the game progress
        public readonly static Frame headerFrame; // where to draw the header logo
        public readonly static Frame table; // where to drow the playing table
        public readonly static Frame betBox; // where to drow the bwtting box
        public readonly static Frame statusDisplay; // where to draw the status area

        public readonly static string[] youWon; // what to draw in case of win
        public readonly static string[] youLoose; // what to draw in case of loss
        public readonly static string[] youPush; // what to draw in case of even points
        public readonly static string[] mainMenuItems; // what to draw in the main menu
        public readonly static string[] afterGameMenu; // what to draw in the game menu after a turn is finnished
        public readonly static string[] inGameMenu; // what do draw in the game nemu, hit, stand, quit.
        public readonly static string[] bettingMenu; // what you want to put in bet
        public readonly static string[] itemsToBet; // bet phisical objects for last resort
        public readonly static string[] logoTitle; // ASCI style multyline logo of text/ the name of the game
        public readonly static string[] gameLogo; // logo in the game, currently Black jack

        static Draw() // this i a static constructor, it is initialized on first use of the class, and only one time or so Nakov said
        {
            // here we set the items for tne menus and other stuff in arrays of strings

            Draw.youWon = new string[] { "Congratulations", "You Won" }; // massage to draw wen player wins
            Draw.youLoose = new string[] { "Very sorry", "You Lost" }; // massage to draw wen player loose
            Draw.youPush = new string[] { "It is a", "push" }; // massage to display when the score is even
            //Draw.mainMenuItems = new string[] { "Black Jack", "Quit" }; // first menu for the game
            //Draw.afterGameMenu = new string[] { "Paly Again", "Quit" }; // after loosing everything ask if play again
            //Draw.inGameMenu = new string[] { "Hit", "Stand", "Surrender" }; // in the black jack choices of play
            //Draw.bettingMenu = new string[] { "Bet $1", "Bet $5", "Bet $10", "Bet $20", "Bet $50", "Bet $100", "Bet $200", "Bet $300", "Bet Item" }; // what sum to bet for the deal
            //Draw.itemsToBet = new string[] { "Wife", "Car", "House", "Watch", "Shirt", "Pants", "Shoose" }; // if no money you can bet some things from the inventory
            Draw.logoTitle = new string[] { 
                                            @"   _____                      _         _____          _             ",
                                            @"  / ____|                    | |       / ____|        (_)            ",
                                            @" | |     ___  _ __  ___  ___ | | ___  | |     __ _ ___ _ _ __   ___  ",
                                            @" | |    / _ \| '_ \/ __|/ _ \| |/ _ \ | |    / _` / __| | '_ \ / _ \ ",
                                            @" | |___| (_) | | | \__ \ (_) | |  __/ | |___| (_| \__ \ | | | | (_) |",
                                            @"  \_____\___/|_| |_|___/\___/|_|\___|  \_____\__,_|___/_|_| |_|\___/ ",
                                           };
            Draw.gameLogo = new string[] {
                                            @" ______ _____   _______ ______ __  __        _____ _______ ______ __  __ ",
                                            @"|   __ \     |_|   _   |      |  |/  |     _|     |   _   |      |  |/  |",
                                            @"|   __ <       |       |   ---|     <     |       |       |   ---|     < ",
                                            @"|______/_______|___|___|______|__|\__|    |_______|___|___|______|__|\__|",
                                         };
            //now we draw the frames for the parts from the interface UI
            Draw.mainFrameBorder = new Frame(new Point(Console.WindowWidth / 2 - GameManager.MainFrameWidth / 2, Console.WindowHeight / 2 - GameManager.MainFrameHeight / 2),
                                             new Point(Console.WindowWidth / 2 + GameManager.MainFrameWidth / 2, Console.WindowHeight / 2 + GameManager.MainFrameHeight / 2));
            Point pointTopLeft = Draw.mainFrameBorder.TopLeft; // corner of the whole frame used as base for other frames
            Point pointBottomRight = Draw.mainFrameBorder.BottomRight; // corner of the wholw frame used as base for other frames
            Draw.headerFrame = new Frame(new Point(pointTopLeft.X, pointTopLeft.Y), new Point(pointBottomRight.X, pointBottomRight.Y - 20)); // done - here set borders of the header box      
            Draw.menuFrame = new Frame(new Point(pointTopLeft.X + 22, pointTopLeft.Y + 7), new Point(pointBottomRight.X - 25, pointBottomRight.Y - 5)); // borders of main menu
            Draw.gameMenu = new Frame(new Point(pointTopLeft.X, pointTopLeft.Y + 6), new Point(pointBottomRight.X - 60, pointBottomRight.Y));// borders of the menu for the player ingame        
            Draw.table = new Frame(new Point(pointTopLeft.X + 20, pointTopLeft.Y + 6), new Point(pointBottomRight.X - 20, pointBottomRight.Y)); // borders of the central tabel on it the cards
            Draw.betBox = new Frame(new Point(pointTopLeft.X + 60, pointTopLeft.Y + 6), new Point(pointBottomRight.X, pointBottomRight.Y - 10)); // borders of th box to show current bet
            Draw.statusDisplay = new Frame(new Point(pointTopLeft.X + 60, pointTopLeft.Y + 16), new Point(pointBottomRight.X, pointBottomRight.Y)); // borders of box show current status
            Draw.plyerCardsFrame = new Frame(new Point(pointTopLeft.X + 21, pointTopLeft.Y + 18), new Point(pointBottomRight.X - 20, pointBottomRight.Y)); // playr's cards Frame
            Draw.dealerCardsFrame = new Frame(new Point(pointTopLeft.X + 21, pointTopLeft.Y + 7), new Point(pointBottomRight.X - 20, pointBottomRight.Y)); // deaalers's cards Frame

        }

        public static void DrawHandResult()
        {
            // TODO: implement drawind of the result of hands by score
        }

        public static void ClearFrame(Frame frame, Style style) // to null frames for updating info
        {
            //TODO: implement clearing of the given frame with the given style
            Console.ForegroundColor = style.foregroundColor; // set color for thext
            Console.BackgroundColor = style.backgroundColor; // set background color
            int rows = frame.Height;
            int cols = frame.Width;
            Point currentPoint = frame.TopLeft; // starting point
            for (int i = 1; i < rows; i++)
            {
                for (int k = 1; k < cols; k++)
                {
                    Draw.WriteString(" ", new Point(currentPoint.X + k, currentPoint.Y + i));
                }
            }
            Console.ResetColor();
        }

        public static void DrawCard(Card card, Point topLeft, int positionInHand) // use to actualy draw a specific card on the table
        {
            bool color; // set the card color black or red
            int offset = 4; // offsets the cards to array them horizontaly
            int positionX = topLeft.X + 1 + offset * (positionInHand - 1); // set the current X position for the card
            string suit = card.CardSuit.ToString(); // get the current card suit
            string rank = card.CardRank.ToString();  // get the current card rank
            Console.BackgroundColor = ConsoleColor.White; // set the background for a card to White
            color = (card.CardSuit.ToString() == Convert.ToString('\u0004') ? false : !(card.CardSuit.ToString() == Convert.ToString('\u0003'))); // chek for the color     
            string bodyTop = string.Concat("│", rank, "    │");
            string bodyBottom = string.Concat("│    ", rank, "│");
            if (card.CardRank.ToString() == "10")
            {
                bodyTop = string.Concat("│", rank, "   │");
                bodyBottom = string.Concat("│   ", rank, "│");
            }
            if (color)
            {
                Console.ForegroundColor = ConsoleColor.Black;
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Red;
            }         
            int verticalDown = 1; // vertical starting point
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);  // the cursor is moving down verticaly by incrementing verticalDown with ++ wich adds 1
            Console.WriteLine("┌─────┐");  // draw cards top
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);
            Console.WriteLine(bodyTop);
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);
            Console.WriteLine(string.Concat("│", suit, "    │"));
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);
            Console.WriteLine(string.Concat("│  ", suit, "  │"));
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);
            Console.WriteLine(string.Concat("│    ", suit, "│"));
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);
            Console.WriteLine(bodyBottom);
            Console.SetCursorPosition(positionX, topLeft.Y + verticalDown++);
            Console.WriteLine("└─────┘"); // drow cards bottom
            Console.ResetColor(); // reset the colors
        }

        public static void DrawFrame(Frame frame) // used to draw the actual frames of the parts of the game
        {
            // TODO: implement how to draw simple rectangular shapes on the console
            Point currentPoint = frame.TopLeft; // set the position to draw at
            Draw.WriteString("╔", new Point(currentPoint.X, currentPoint.Y)); // draw the up left corner
            currentPoint = frame.TopRight; // set next position
            Draw.WriteString("╗", new Point(currentPoint.X, currentPoint.Y)); // draw up right corner
            currentPoint = frame.BottomLeft; // set next position
            Draw.WriteString("╚", new Point(currentPoint.X, currentPoint.Y)); // draw low left corner
            currentPoint = frame.BottomRight;  // set next position
            Draw.WriteString("╝", new Point(currentPoint.X, currentPoint.Y)); // draw low right corner
            // now lets draw the vertical lines
            for (int lenght = 0; lenght < frame.Height - 1; lenght++)
            {
                currentPoint = frame.TopLeft; // set current position
                Draw.WriteString("║", new Point(currentPoint.X, currentPoint.Y + lenght + 1)); // draw vertical line from the current position + the lenght vertical, this for left side
                currentPoint = frame.TopRight; // set the other position
                Draw.WriteString("║", new Point(currentPoint.X, currentPoint.Y + lenght + 1));// draw vertical line from the current position + the lenght vertical, this for right side
            }
            // now draw the horiozontal lines          
            for (int lenght = 0; lenght < frame.Width - 1; lenght++)
            {
                currentPoint = frame.TopLeft; // set starting point
                Draw.WriteString("═", new Point(currentPoint.X + lenght + 1, currentPoint.Y));
                currentPoint = frame.BottomLeft; // set down side position
                Draw.WriteString("═", new Point(currentPoint.X + lenght + 1, currentPoint.Y));
            }
        }

        public static void DrawMenu(Menu menu) // used to draw specific menu items
        {
            // TODO: implement way to draw text menus on the console // think is completed, dont know if will work
            string[] menuItems = menu.MenuItems;
            Frame frame = menu.MenuFrame;
            Style style = menu.MenuStyle;
            Draw.DrawTextInFrame(menuItems, frame, style);
            int lenght = menuItems.Length;
            Console.BackgroundColor = style.backgroundColor;
            Console.ForegroundColor = style.foregroundColor;

            Console.ResetColor();
        }

        public static void DrawResultFromSumedCards(BlackJackPlayer player, BlackJackDealer dealer) // used for displaing the afterresult after a game
        {
            //TODO: implement drawing of the result drom comparing the result of the two players after game edns
        }

        public static void DrawTextInFrame(string[] items, Frame frame, Style style) // used to draw text inside a frame of the game
        {
            // TODO: implement how to draw text inside a frame  // completed
            Console.ForegroundColor = style.foregroundColor; // set color for thext
            Console.BackgroundColor = style.backgroundColor; // set background color
            int lenght = items.Length; // count the items
            Point currentPoint = frame.TopLeft; // starting point
            for (int index = 0; index < lenght; index++)
            {

                Draw.WriteString(items[index], new Point(currentPoint.X + frame.Width / 2 - lenght / 2, currentPoint.Y + frame.Height / 2 - lenght / 2 + index + 1));
            }
            Console.ResetColor();
        }

        public static void DrawLogoInFrame(string[] logo, Frame frame, Style style)
        {
            Console.ForegroundColor = style.foregroundColor; // set color for thext
            Console.BackgroundColor = style.backgroundColor; // set background color
            int lenght = logo.Length; // count the items
            Point currentPoint = frame.TopLeft; // starting point
            for (int index = 0; index < lenght; index++)
            {
                Draw.WriteString(logo[index], new Point(currentPoint.X + frame.Width / 2 - logo[index].Length / 2, currentPoint.Y + frame.Height / 2 - lenght / 2 + index + 1));
            }
            Console.ResetColor();
        }

        public static void WriteString(string text, Point topLeft) // used to write simple strings at specific position
        {
            // TODO: write how to write text strings on the console at a starting top left corner  // completed
            Console.SetCursorPosition(topLeft.X, topLeft.Y);
            Console.Write(text);
        }

        public static void WriteStringStyled(string text, Style style, Point topLeft) // used for writing strings with colors at specific position
        {
            // TODO: write a way to display strings on the console by specific style colors and from top left corner // completed
            Console.ForegroundColor = style.foregroundColor;
            Console.SetCursorPosition(topLeft.X, topLeft.Y);
            Console.Write(text);
        }
    }
}
