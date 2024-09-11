import { createSupabaseClient } from "@/utils/supabase/client";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { Client } from "@/utils/database/types";
import { customThunkCreator } from "@/store/utils";

const FETCH_ALL_CLIENTS = "client/getAll";
const FETCH_CLIENT_BY_ID = "client/get";
const CREATE_CLIENT = "client/create";
const UPDATE_CLIENT = "client/update";
const DELETE_CLIENT = "client/delete";

const client = new ClientRepo(createSupabaseClient());

export const getAllClient = customThunkCreator<string, Client[]>(
  FETCH_ALL_CLIENTS,
  "Error ocuured fetching clients",
  async (clientName: string) => {
    const allClientData = await client.getWithName(clientName);
    return allClientData;
  }
);

export const getClient = customThunkCreator<string, Client>(
  FETCH_CLIENT_BY_ID,
  "Error ocuured fetching products",
  async (clientId: string) => {
    const clientData = await client.get(clientId);
    return clientData;
  }
);

export const createClient = customThunkCreator<Client, Client>(
  CREATE_CLIENT,
  "Error ocuured creating products",
  async (newClient: Client) => {
    const clientData = await client.create(newClient);
    return clientData;
  }
);

export const updateClient = customThunkCreator<Client, Client>(
  UPDATE_CLIENT,
  "Error ocuured updating products",
  async (clientValues: Client) => {
    const clientData = await client.update(clientValues.id, clientValues);
    return clientData;
  }
);

export const deleteClient = customThunkCreator<string, void>(
  DELETE_CLIENT,
  "Error ocuured deleting products",
  async (id: string) => {
    await client.delete(id);
  }
);
