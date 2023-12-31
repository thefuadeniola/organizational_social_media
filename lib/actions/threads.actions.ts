'use server'
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.models";
import User from "../models/user.models";
import { revalidatePath } from "next/cache";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize

    // Fetch posts that are not children (threads only, no comments)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author', model: User, select: '_id name parentId image'
            }
        })

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })
    const posts = await postsQuery.exec()

    const isNext = totalPostsCount > skipAmount + posts.length

    return { posts, isNext }
}

export async function fetchThreadById(id: string) {
    connectToDB();
    try {
        // TODO: Populate Community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id username image'
            })
            .populate({
                path: "children", // Populate the children field
                populate: [
                    {
                        path: "author", // Populate the author field within children
                        model: User,
                        select: "_id id username parentId image", // Select only _id and username fields of the author
                    },
                    {
                        path: "children", // Populate the children field within children
                        model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                        populate: {
                            path: "author", // Populate the author field within nested children
                            model: User,
                            select: "_id id username parentId image", // Select only _id and username fields of the author
                        },
                    },
                ],
            })
            .exec();

        return thread;

    } catch (error: any) {
        throw new Error(`Unable to fetch thread, ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    console.log(userId)
    try {
        connectToDB();

        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error('Thread not found')
        }
        const addedComment = await Thread.create({
            text: commentText,
            author: userId,
            community: null,
            parentId: threadId

        })
        await Thread.findByIdAndUpdate(threadId, {
            $push: { children: addedComment._id }
        })

        await originalThread.save
        revalidatePath(path)

    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}