using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public static class GameManager // basic methods for control of the game action. currently used for a black jack games only
    {
        public static readonly int MainFrameHeight = 26;
        public static readonly int MainFrameWidth = 80;
        private static Menu currentMenu;
        public static BlackJackPlayer BJPlayer { get; private set; }
        public static BlackJackDealer BJDealer { get; private set; }
        public static string Control { get; private set; }
        public static void StartCasino() // starts the main casino menu where choose where to play at the casino also used for main game loop
        {
            Control = string.Empty; // initialize a control string
            string[] mainMenuItems = new string[] { "Black Jack", "Quit" }; // first menu for the game
            string[] afterGameMenuItems = new string[] { "Play Again", "To Main" }; // after loosing everything ask if play again
            string[] inGameMenuItems = new string[] { "Hit", "Stand", "Surrender" }; // in the black jack choices of play
            string[] bettingMenuItems = new string[] { "Bet $1", "Bet $5", "Bet $10", "Bet $20", "Bet $50", "Bet $100", "Bet $200", "Bet $300", "Bet Item" }; // what sum to bet for the deal
            string[] itemsToBet = new string[] { "Wife", "Car", "House", "Watch", "Shirt", "Pants", "Shoose" }; // if no money you can bet some things from the inventory
            Menu mainMenu = new Menu(mainMenuItems, Draw.menuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
            Menu bettingMenu = new Menu(bettingMenuItems, Draw.gameMenu, new Style(ConsoleColor.White, ConsoleColor.Black));
            Menu inGameMenu = new Menu(inGameMenuItems, Draw.gameMenu, new Style(ConsoleColor.White, ConsoleColor.Black));
            Menu afterGameMenu = new Menu(afterGameMenuItems, Draw.gameMenu, new Style(ConsoleColor.White, ConsoleColor.Black));
            Menu itemsBetMenu = new Menu(itemsToBet, Draw.gameMenu, new Style(ConsoleColor.White, ConsoleColor.Black));
            currentMenu = mainMenu;
            MainGUI(); // start the main GUI interface
            // TODO: make player dealer, stats, money - create new objects first make invenory, generate deck
            BJPlayer = new BlackJackPlayer("Pesho", Gender.Male, 1000);
            BJDealer = new BlackJackDealer(new CardsDeck());
            Status stats = new Status(BJPlayer);
            Draw.DrawMenu(currentMenu); // get control string from first main menu
            Control = currentMenu.CheckInput();
            BJPlayer.Subscribe(BJDealer);
            while (true) // main game loop
            {
                bool inGame = Control != "Quit";
                if (!inGame)
                {
                    break; // if control gets "Quit" this brakes the main loop
                }

                if (Control != null)
                {
                    if (Control.Contains("Bet"))
                    {
                        string bet = Control.Substring(Control.IndexOf("$") + 1);
                        int wager = int.Parse(bet);
                        Control = PlaceBet(wager, BJPlayer, BJDealer, inGame);
                    }
                    else
                    {
                        switch (Control) // get controle string value and performe tasks depending on the control
                        {
                            case "Black Jack":
                                {
                                    currentMenu.Position = 0;
                                    currentMenu = bettingMenu;
                                    BlackJackTable(); // draw the main game screen
                                    Draw.DrawMenu(currentMenu); // get control string from first main menu
                                    Control = currentMenu.CheckInput();
                                    break;
                                }                           
                            case "Bet Item":
                                {
                                    currentMenu.Position = 0;
                                    currentMenu = itemsBetMenu;
                                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.Black, ConsoleColor.Black));
                                    Draw.DrawMenu(currentMenu); // get control string from first main menu
                                    Control = currentMenu.CheckInput();
                                    break;
                                }
                            case "Hit":
                                {
                                    BJDealer.DealCardToPlayer(BJPlayer);
                                    if (BJPlayer.CountScore() > 21)
                                    {
                                        Control = "Dealer win";
                                    }
                                    else if (BJPlayer.CountScore() == 21)
                                    {
                                        if (BJPlayer.Hand.Count() == 2)
                                        {
                                            BJPlayer.GetBlackJack();
                                        }
                                        BJDealer.DealCardHimself(true, BJPlayer.CountScore());
                                        Control = BJDealer.CheckScore(BJPlayer);
                                    }
                                    else
                                    {
                                        Control = currentMenu.CheckInput();
                                    }
                                    break;
                                }
                            case "Stand":
                                {
                                    BJDealer.DealCardHimself(true, BJPlayer.CountScore());
                                    Control = BJDealer.CheckScore(BJPlayer);
                                    break;
                                }
                            case "Surrender":
                                {
                                    BJDealer.HandleMoney(BJDealer.Wager / 2, BJPlayer);
                                    currentMenu = afterGameMenu;
                                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawMenu(currentMenu);
                                    BJPlayer.ClearHand();
                                    BJDealer.ClearHand();
                                    Control = currentMenu.CheckInput();
                                    break;
                                }
                            case "Player win":
                                {
                                    currentMenu.Position = 0;
                                    currentMenu = afterGameMenu;
                                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawMenu(currentMenu);
                                    BJPlayer.ClearHand();
                                    BJDealer.ClearHand();
                                    Draw.DrawTextInFrame(Draw.youWon, Draw.table, new Style(ConsoleColor.Red, ConsoleColor.Black));
                                    Control = currentMenu.CheckInput();
                                    break;
                                }
                            case "Dealer win":
                                {
                                    currentMenu.Position = 0;
                                    currentMenu = afterGameMenu;
                                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawMenu(currentMenu);
                                    BJPlayer.ClearHand();
                                    BJDealer.ClearHand();
                                    Draw.DrawTextInFrame(Draw.youLoose, Draw.table, new Style(ConsoleColor.Red, ConsoleColor.Black));
                                    Control = currentMenu.CheckInput();
                                    break;
                                }
                            case "Push":
                                {
                                    currentMenu.Position = 0;
                                    currentMenu = afterGameMenu;
                                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawMenu(currentMenu);
                                    BJPlayer.ClearHand();
                                    BJDealer.ClearHand();
                                    Draw.DrawTextInFrame(Draw.youPush, Draw.table, new Style(ConsoleColor.Red, ConsoleColor.Black));
                                    Control = currentMenu.CheckInput();
                                    break;
                                }
                            case "Play Again":
                                {
                                    currentMenu = bettingMenu;
                                    currentMenu.Position = 0;
                                    Draw.ClearFrame(Draw.betBox, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.DrawMenu(currentMenu);
                                    Draw.ClearFrame(Draw.dealerCardsFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Draw.ClearFrame(Draw.plyerCardsFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                                    Control = currentMenu.CheckInput();
                                    break;
                                }
                            case "To Main":
                                {
                                    Console.Clear();
                                    StartCasino();
                                    break;
                                }
                            default:
                                Console.Clear();
                                StartCasino();
                                break;
                        }
                    }                   
                }
            }
            Environment.Exit(0);
        }

        public static void BlackJackTable() // describes the main playing table
        {
            Console.Clear(); // clear the prevoius buffer
            Draw.DrawFrame(Draw.headerFrame); // draw the main header border
            Draw.DrawLogoInFrame(Draw.gameLogo, Draw.headerFrame, new Style(ConsoleColor.Red, ConsoleColor.Black)); // put a logo of black jack game
            Draw.DrawFrame(Draw.gameMenu); // draw the ingame menu
            Draw.DrawFrame(Draw.table); // draw the table border
            Draw.DrawFrame(Draw.statusDisplay); // draw the status box
            Draw.DrawFrame(Draw.betBox); // draw the current bet box


        }

        public static void MainGUI() // used to draw the main interface
        {
            Draw.DrawFrame(Draw.headerFrame); // header frame
            Draw.DrawFrame(Draw.menuFrame); // menu frame main menu
            Draw.DrawLogoInFrame(Draw.logoTitle, Draw.headerFrame, new Style(ConsoleColor.Red, ConsoleColor.Black)); // TODO: draw the texts inside header and menu
        }

        public static void PutInBetBox(int bet)
        {
            Draw.DrawTextInFrame(new string[] { "Your bet:", bet.ToString() }, Draw.betBox, new Style(ConsoleColor.White, ConsoleColor.Black));
        }

        public static string PlaceBet(int value, BlackJackPlayer player, BlackJackDealer dealer, bool inGame)
        {
            currentMenu = new Menu(new string[] { "Hit", "Stand", "Surrender" }, Draw.gameMenu, new Style(ConsoleColor.White, ConsoleColor.Black));
            BJDealer.Wager = value;
            BJDealer.HandleMoney(-value, BJPlayer);
            player.IsGaming = true;
            PutInBetBox(value); // display the bet in the top right box
            dealer.ShuffleCards(); // the dealer shuffeles the card deck
            // display the current status
            inGame = player.CanBet(value); // chec to see if player has that amount of cache
            if (inGame)
            {
                dealer.DealCardToPlayer(player); // dealer gives card to the player first card
                dealer.DealCardToPlayer(player); // dealer gives card to the player second card
                BJDealer.DealCardHimself(false, BJPlayer.CountScore()); // dealer deals himselfe one card
                Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black)); // update the status
                //Draw.DrawHandResult(); // TODO: must be done
                int startScore = player.CountScore();
                if (startScore == int.MaxValue) // TODO fix bug when 21 on first hand
                {
                    BJDealer.DealCardHimself(true, BJPlayer.CountScore());
                    Control = dealer.CheckScore(BJPlayer);
                    if (Control == "Player win")
                    {
                        currentMenu.Position = 0;
                        currentMenu = new Menu(new string[] { "Play Again", "To Main" }, Draw.gameMenu, new Style(ConsoleColor.White, ConsoleColor.Black));
                        Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.White, ConsoleColor.Black));
                        Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                        Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                        Draw.DrawMenu(currentMenu);
                        BJPlayer.ClearHand();
                        BJDealer.ClearHand();
                        Draw.DrawTextInFrame(Draw.youWon, Draw.table, new Style(ConsoleColor.Red, ConsoleColor.Black));
                     
                    }
                    
    
                }
                    inGame = player.CountScore() != -1; // check for valid score
                    if (inGame)
                    {
                        Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.Black, ConsoleColor.Black));
                        Draw.DrawMenu(currentMenu);
                        return currentMenu.CheckInput();
                    }
                else
                {
                    //TODO: clear the game
                    player.ClearHand();
                    dealer.ClearHand();
                    Draw.ClearFrame(Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                    Draw.DrawTextInFrame(new string[] { "Money:" + BJPlayer.Money }, Draw.statusDisplay, new Style(ConsoleColor.White, ConsoleColor.Black));
                    Draw.ClearFrame(Draw.betBox, new Style(ConsoleColor.Black, ConsoleColor.Black));
                    Draw.DrawTextInFrame(Draw.youWon, Draw.betBox, new Style(ConsoleColor.White, ConsoleColor.Black));
                    Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.Black, ConsoleColor.Black));
                    player.IsGaming = false;
                    Draw.DrawMenu(currentMenu);
                    return currentMenu.CheckInput();
                }
            }
            else // here is a bug if wager is bigger than curent money, the game must clear and return to betting menu again to choose smaller bet, currently it draws the ingame menu.
            {
                Draw.ClearFrame(currentMenu.MenuFrame, new Style(ConsoleColor.Black, ConsoleColor.Black));
                Draw.DrawMenu(currentMenu);
                return currentMenu.CheckInput();  // get control string from betting menu
            }
        }
    }
}
