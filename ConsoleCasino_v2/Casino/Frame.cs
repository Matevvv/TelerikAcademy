using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Casino
{
    public struct Frame  // holds info about rectangular objects used to build the interface
    {
        public Point TopLeft { get; set; }
        public Point TopRight { get; set; }
        public Point BottomLeft { get; set; }
        public Point BottomRight { get; set; }
        public int Width { get; private set; }
        public int Height { get; private set; }

        public Frame(Point topLeft, Point topRight, Point bottomLeft, Point bottomRight) : this()
        {
            this.TopLeft = topLeft;
            this.TopRight = topRight;
            this.BottomLeft = bottomLeft;
            this.BottomRight = bottomRight;
            this.Width = topRight.X - topLeft.X;
            this.Height = bottomLeft.Y - topLeft.Y;
        }

        public Frame(Point topLeft, Point bottomRight) : this()
        {
            this.TopLeft = topLeft;
            this.BottomRight = bottomRight;
            this.TopRight = new Point(bottomRight.X, topLeft.Y);
            this.BottomLeft = new Point(topLeft.X, bottomRight.Y);
            this.Width = bottomRight.X - topLeft.X;
            this.Height = bottomRight.Y - topLeft.Y;
        }
    }
}
