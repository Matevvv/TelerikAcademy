namespace CrowdSourcedNews.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Comment
    {
        private ICollection<Comment> subComments;

        public Comment()
        {
            this.subComments = new List<Comment>();
        }

        [Key, Column("CommentID")]
        public int ID { get; set; }

        public int AuthorID { get; set; }

        [Required, ForeignKey("AuthorID")]
        public virtual User Author { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime Date { get; set; }

        public int? ParentID { get; set; }

        [ForeignKey("ParentID")]
        public virtual Comment ParentComment { get; set; }

        public virtual ICollection<Comment> SubComments
        {
            get { return this.subComments; }

            set { this.subComments = value; }
        }
    }
}
