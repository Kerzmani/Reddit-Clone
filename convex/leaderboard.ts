import { query } from "./_generated/server";
import { v } from "convex/values";
import { counter } from "./counter";
import { voteKey } from "./vote";

export const getTopPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    // No index on creation time defined in the schema; collect posts and filter in-memory.
    const allPosts = await ctx.db.query("post").collect();
    const posts = allPosts.filter((p) => p._creationTime > oneDayAgo.getTime());

    const postWithScores = await Promise.all(
      posts.map(async (post) => {
        const upvotes = await counter.count(ctx, voteKey(post._id, "upvote"));
        const downvotes = await counter.count(ctx, voteKey(post._id, "downvote"));

        const author = await ctx.db.get(post.authorId)
        const subreddit = await ctx.db.get(post.subreddit);

        return {
          ...post, 
          score: upvotes - downvotes, 
          upvotes, 
          downvotes, 
          author: {username:author?.username ?? "[deleted]"},
          subreddit: {name: subreddit?.name ?? "[deleted]"}

        }
      }),
    );

    return postWithScores.sort((a,b) => b.score - a.score).slice(0,limit)
  },
});
