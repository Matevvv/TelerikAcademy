namespace CrowdSourcedNews.DataTransferObjects
{
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public class CommentModel : CommentDetails
    {
        public CommentModel()
        {
            this.SubComments = new List<CommentDetails>();
        }

        [DataMember(Name = "subComments")]
        public ICollection<CommentDetails> SubComments { get; set; }
    }
}
