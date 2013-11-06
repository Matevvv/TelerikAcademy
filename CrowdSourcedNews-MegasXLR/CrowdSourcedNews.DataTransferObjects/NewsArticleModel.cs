namespace CrowdSourcedNews.DataTransferObjects
{
    using System;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    [DataContract]
    public class NewsArticleModel : NewsArticleDetails
    {
        public NewsArticleModel()
        {
            this.ImagesUrls = new List<string>();
            this.Comments = new List<CommentModel>();
        }

        [DataMember(Name = "content")]
        public string Content { get; set; }

        [DataMember(Name = "images")]
        public IList<string> ImagesUrls { get; set; }

        [DataMember(Name = "comments")]
        public IList<CommentModel> Comments { get; set; }
    }
}
