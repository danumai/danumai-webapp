import { prisma } from "@/lib/prisma";
import type {
  Application as ApplicationModel,
  ContactMessage as ContactMessageModel,
} from "@/generated/prisma/client";

// Submissions are the "people" side of the site: job applications from the
// careers page and messages from the contact form. They share the same shape
// in the admin panel (someone reaching out, plus a read flag), so the read/
// list/delete helpers for both live together here.

export type Application = {
  id: string;
  jobTitle: string;
  name: string;
  email: string;
  portfolio: string;
  note: string;
  read: boolean;
  createdAt: string;
};

function mapApplication(row: ApplicationModel): Application {
  return {
    id: row.id,
    jobTitle: row.jobTitle,
    name: row.name,
    email: row.email,
    portfolio: row.portfolio,
    note: row.note,
    read: row.read,
    createdAt: row.createdAt.toISOString(),
  };
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function mapContactMessage(row: ContactMessageModel): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    topic: row.topic,
    message: row.message,
    read: row.read,
    createdAt: row.createdAt.toISOString(),
  };
}

// --- Applications ---------------------------------------------------------

export async function createApplication(input: {
  jobTitle: string;
  name: string;
  email: string;
  portfolio: string;
  note: string;
}): Promise<void> {
  await prisma.application.create({ data: input });
}

export async function listApplications(): Promise<Application[]> {
  const rows = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapApplication);
}

export async function setApplicationRead(id: string, read: boolean): Promise<void> {
  await prisma.application.update({ where: { id }, data: { read } });
}

export async function deleteApplication(id: string): Promise<void> {
  await prisma.application.delete({ where: { id } });
}

// --- Contact messages -----------------------------------------------------

export async function createContactMessage(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<void> {
  await prisma.contactMessage.create({ data: input });
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapContactMessage);
}

export async function setContactMessageRead(id: string, read: boolean): Promise<void> {
  await prisma.contactMessage.update({ where: { id }, data: { read } });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await prisma.contactMessage.delete({ where: { id } });
}
