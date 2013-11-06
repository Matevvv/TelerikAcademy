namespace CrowdSourcedNews.Mappers
{
    using CrowdSourcedNews.DataTransferObjects;
    using CrowdSourcedNews.Models;
    using CrowdSourcedNews.Repositories;

    public static class CommentsMapper
    {
        public static Comment ToCommentEntity(CommentModel commentModel, DbUsersRepository usersRepository)
        {
            Comment commentEntity = new Comment()
                {
                    ID = commentModel.ID,
                    Content = commentModel.Content,
                    Date = commentModel.Date,
                    Author = usersRepository.GetByNickname(commentModel.Author)
                };

            foreach (CommentDetails subComment in commentModel.SubComments)
            {
                commentEntity.SubComments.Add(new Comment()
                {
                    ID = subComment.ID,
                    Content = subComment.Content,
                    Date = subComment.Date,
                    Author = usersRepository.GetByNickname(subComment.Author)
                });
            }

            return commentEntity;
        }

        public static CommentModel ToCommentModel(Comment commentEntity)
        {
            CommentModel commentModel = new CommentModel()
                {
                    ID = commentEntity.ID,
                    Author = commentEntity.Author.Nickname,
                    Content = commentEntity.Content,
                    Date = commentEntity.Date
                };

            foreach (Comment subComment in commentEntity.SubComments)
            {
                commentModel.SubComments.Add(new CommentDetails()
                    {
                        ID = subComment.ID,
                        Author = subComment.Author.Nickname,
                        Content = subComment.Content,
                        Date = subComment.Date
                    });
            }

            return commentModel;
        }
    }
}
