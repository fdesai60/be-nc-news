\c nc_news_test;
-- SELECT author,title,article_id,topic,created_at,votes,article_img_url 
-- FROM articles
-- JOIN comments
-- ON articles.article_id = comments.article_id ;

-- SELECT articles.article_id,comments.comment_id,comments.author
-- FROM articles
-- JOIN comments
-- ON articles.article_id = comments.article_id ;

-- THIS WORKS
-- SELECT articles.article_id,COUNT(comment_id) AS comment_count
-- FROM articles
-- JOIN comments
-- ON articles.article_id = comments.article_id
-- GROUP BY articles. article_id;


-- selectApiArticles
SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,COUNT(comment_id) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles. article_id
ORDER BY articles.created_at DESC;



