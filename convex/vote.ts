import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./users";
import { counter } from "./counter";

type VoteType = "upvote" | "downvote";

function voteKey(postId: string, voteType: VoteType): string {
  return `${voteType}:${postId}`;
}

export function createToggleVoteMutation(voteType: VoteType) {
  return mutation({
    args: { postId: v.id("post") },
    handler: async (ctx, args) => {
      const user = await getCurrentUserOrThrow(ctx);
      const oppositeVoteType: VoteType =
        voteType === "upvote" ? "downvote" : "upvote";

      const existingVote = await ctx.db
        .query(voteType)
        .withIndex("byPost", (q) => q.eq("postId", args.postId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();

      if (existingVote) {
        await ctx.db.delete(existingVote._id);
        await counter.dec(ctx, voteKey(args.postId, voteType));
        return;
      }

      const existingOppositeVote = await ctx.db
        .query(oppositeVoteType)
        .withIndex("byPost", (q) => q.eq("postId", args.postId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();

      if (existingOppositeVote) {
        await ctx.db.delete(existingOppositeVote._id);
        await counter.dec(ctx, voteKey(args.postId, oppositeVoteType));
      }

      await ctx.db.insert(voteType, {
        postId: args.postId,
        userId: user._id,
      });
      await counter.inc(ctx, voteKey(args.postId, voteType));
    },
  });
}

export function createHasVotedQuery(voteType: VoteType) {
  return query({
    args: { postId: v.id("post") },
    handler: async (ctx, args) => {
      const user = await getCurrentUser(ctx);

      if (!user) return false;

      const vote = await ctx.db
        .query(voteType)
        .withIndex("byPost", (q) => q.eq("postId", args.postId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();

        return !!vote
    },
  });
}

export const toggleUpVote = createToggleVoteMutation("upvote");
export const toggleDownVote = createToggleVoteMutation("downvote");
export const hasUpvoted = createHasVotedQuery("upvote");
export const hasDownvoted = createHasVotedQuery("downvote");

export const getVoteCount = query({
  args: {postId: v.id("post")},
  handler: async (ctx, args) => {
    const upvotes = await counter.count(ctx, voteKey(args.postId, "upvote"))
    const downvotes = await counter.count(ctx, voteKey(args.postId, "downvote"))
    return { upvotes, downvotes, total: upvotes - downvotes }
  }
})
