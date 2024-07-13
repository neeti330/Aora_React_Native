import { formType } from "@/app/(tabs)/create";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ng.aurora",
  projectId: "668e8c550009bade7e0f",
  databaseId: "668e95c20024014e197c",
  userCollectionId: "668e95e60035338ae364",
  videoCollectionId: "668e9629001bb2bb0d4e",
  storageId: "668e97e1000d8e07b165",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username); //will take initital of username
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accoundId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

// Sign In
export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accoundId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

// Get All Posts
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      (Query.orderDesc("$createdAt"), Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get Latest Posts
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      // Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Search Posts through Query
export const searchPosts = async (query: string | string[] | undefined) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query as string),
    ]);

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get User Posts through Id
export const getUserPosts = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

// File Preview
export const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000
        // "top",
        // 100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Upload File
export const uploadFile = async (
  file: formType["thumbnail"] | formType["video"],
  type: string
) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  console.log("File", file);

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset as any
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Upload Video
export const createVideo = async (form: formType, userId: string) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
};
