"use server";

import { createSessionClient,createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";
import { Query, ID } from "node-appwrite";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "@/lib/utils";
import { redirect } from  "next/navigation"; 

const getUserByEmail =  async(email:string)=>{
    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userscollectionId,
        [Query.equal("email", [email])],
    );
    return result.total > 0 ? result.documents[0] : null;
};
const handleError = (error:unknown,message:string)=>{
    console.log(error,message);
    throw error;
};


export const sendEmailOTP = async (accountId: string, email: string) => {
  const { account } = await createAdminClient(); // pas createSessionClient

  try {
    await account.createEmailToken(accountId, email);
    return accountId;
  } catch (error) {
    handleError(error, "Impossible d'envoyer un OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    // Renvoie juste son ID si déjà inscrit
    await sendEmailOTP(existingUser.accountId, email);
    return parseStringify({ accountId: existingUser.accountId });
  }

  const { account, databases } = await createAdminClient();

  // 1. Créer un vrai utilisateur Appwrite
  const newAccount = await account.create(ID.unique(), email, "password-temp");

  // 2. Envoyer OTP
  await sendEmailOTP(newAccount.$id, email);

  // 3. Sauvegarder dans ta DB custom
  await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userscollectionId,
    ID.unique(),
    {
      fullName,
      email,
      avatar: avatarPlaceholderUrl,
      accountId: newAccount.$id,
    }
  );

  return parseStringify({ accountId: newAccount.$id });
};


export const verifySecret=async( {
    accountId,
    password,
}: {
    accountId:string;
    password:string;
}) =>{
    try{
        const {account}= await createAdminClient();

        const session = await account.createSession(accountId,password);
        (await cookies()).set ("appwrite-session",session.secret,{
            httpOnly:true,
            path:"/",
            sameSite:"strict",
            secure:true,
        });
        return parseStringify({sessionId:session.$id});

    } catch (error){
        handleError(error,"Impossible de verifier l'OTP");
    }
};

export const getCurrentUser = async () =>{
    try {
        const {databases,account} = await createSessionClient();

        const result = await account.get();

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userscollectionId,
            [Query.equal("accountId", [result.$id])],
        );

        if (user.total<= 0) return null;

        return parseStringify(user.documents[0]);

    } catch (error){
        console.log(error);
    }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  
  try{
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error){
    handleError(error,"Impossible de se deconnecter");
  } finally {
        redirect ("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return parseStringify({ accountId: null, error: "Utilisateur inconnu" });
    }

    await sendEmailOTP(existingUser.accountId, email);
    return parseStringify({ accountId: existingUser.accountId });
  } catch (error) {
    handleError(error, "Impossible de se connecter");
  }
};
