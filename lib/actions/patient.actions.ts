"use server";

import { ID, Query } from "node-appwrite";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "../validation";

import {
  users,
  storage,
  BUCKET_ID,
  databases,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  ENDPOINT,
  PROJECT_ID,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log("An error occurred while retrieving the user details:", error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      const blobFile = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;

      if (blobFile && fileName) {
        //backend validation layer
        if (blobFile.size > MAX_FILE_SIZE) {
          throw new Error("File size exceeds 5MB Limit");
        }

        if (blobFile.size === 0) {
          throw new Error("File is empty");
        }

        if (!ACCEPTED_FILE_TYPES.includes(blobFile.type)) {
          throw new Error(
            `Invalid file type. Allowed: ${ACCEPTED_FILE_TYPES.join(", ")}`,
          );
        }

        //convert Blob into file object
        const fileObject = new File([blobFile], fileName, {
          type: blobFile.type,
        });

        //Upload file to storage
        file = await storage.createFile(BUCKET_ID!, ID.unique(), fileObject);
      }
    }

    //create a new dtb document(record) for patient
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      },
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log("An error occurred while creating a new patient", error);
    throw error;
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])],
    );

    if (!patients.documents || patients.documents.length === 0) {
      return null;
    }

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(
      "An error occurred while retrieving the patient details:",
      error,
    );
  }
};
